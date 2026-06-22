<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\Pembayaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;
use Throwable;

class PembayaranController extends Controller
{
    private function setupMidtrans(): void
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    private function expirePaymentIfNeeded(Pembayaran $pembayaran): bool
    {
        if (
            $pembayaran->status_pem !== 'menunggu' ||
            !$pembayaran->batas_wkt_pem ||
            !now()->greaterThan($pembayaran->batas_wkt_pem)
        ) {
            return false;
        }

        $pembayaran->update([
            'status_pem' => 'kadaluarsa',
        ]);
        $pembayaran->refresh();

        return true;
    }

    private function terminalStatusMessage(string $status): ?string
    {
        return match ($status) {
            'lunas' => 'Pesanan sudah dibayar',
            'kadaluarsa' => 'Pembayaran sudah kadaluarsa',
            'gagal' => 'Pembayaran gagal',
            default => null,
        };
    }

    private function rejectIfTerminalStatus(Pembayaran $pembayaran): ?JsonResponse
    {
        $message = $this->terminalStatusMessage($pembayaran->status_pem);

        if (!$message) {
            return null;
        }

        return response()->json([
            'message' => $message,
        ], 422);
    }

    public function show(int $id)
    {
        $pesanan = Pesanan::with('pembayaran')
            ->findOrFail($id);

        $user = Auth::user();

        if ($pesanan->id_peng_fk_ps !== $user->id_pengguna) {
            abort(403, 'Akses ditolak');
        }

        if (!$pesanan->pembayaran) {
            abort(404, 'Data pembayaran tidak ditemukan');
        }

        $pembayaran = $pesanan->pembayaran;
        $this->expirePaymentIfNeeded($pembayaran);

        return response()->json([
            'pesanan_id' => $pesanan->id_pesanan,
            'kode_pesanan' => $pesanan->kode_pesanan,
            'total' => $pesanan->total_harga,
            'status_pembayaran' => $pembayaran->status_pem,
            'snap_token' => $pembayaran->snap_token,
            'batas_wkt_pem' => $pembayaran->batas_wkt_pem,
            'server_time' => now()->toIso8601String(),
            'metode' => 'QRIS',
        ]);
    }

    public function createTransaction(Request $request)
    {
        $request->merge([
            'id_pesanan' => $request->input(
                'id_pesanan',
                $request->input('pesanan_id')
            ),
        ]);

        $request->validate([
            'id_pesanan' => 'required|integer',
        ]);

        $pesanan = Pesanan::with('pembayaran')
            ->findOrFail($request->id_pesanan);

        $user = Auth::user();

        if ($pesanan->id_peng_fk_ps !== $user->id_pengguna) {
            abort(403, 'Akses ditolak');
        }

        $pembayaran = $pesanan->pembayaran;

        if (!$pembayaran) {
            return response()->json([
                'message' => 'Data pembayaran tidak ditemukan',
            ], 404);
        }

        $this->expirePaymentIfNeeded($pembayaran);

        if ($response = $this->rejectIfTerminalStatus($pembayaran)) {
            return $response;
        }

        if ($pembayaran->snap_token) {
            return response()->json([
                'snap_token' => $pembayaran->snap_token,
            ]);
        }

        $this->setupMidtrans();

        $params = [
            'transaction_details' => [
                'order_id' => $pesanan->kode_pesanan,
                'gross_amount' => (int) round($pesanan->total_harga),
            ],
            'customer_details' => [
                'first_name' => $user->nama,
                'phone' => $user->no_hp,
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
        } catch (Throwable $e) {
            report($e);

            $message = config('app.debug')
                ? 'Gagal membuat transaksi Midtrans: ' . $e->getMessage()
                : 'Gagal membuat transaksi pembayaran';

            return response()->json([
                'message' => $message,
            ], 500);
        }

        $pembayaran->update([
            'snap_token' => $snapToken,
        ]);

        return response()->json([
            'snap_token' => $snapToken,
        ]);
    }

    public function handleNotification(Request $request)
    {
        $this->setupMidtrans();

        $orderId = $request->input('order_id');
        $statusCode = $request->input('status_code');
        $grossAmount = $request->input('gross_amount');
        $signatureKey = (string) $request->input('signature_key', '');

        $expectedSignature = hash(
            'sha512',
            $orderId .
            $statusCode .
            $grossAmount .
            config('midtrans.server_key')
        );

        if (!hash_equals($expectedSignature, $signatureKey)) {
            return response()->json([
                'message' => 'Signature tidak valid',
            ], 403);
        }

        try {
            $notif = new Notification();

            $pesanan = Pesanan::where(
                'kode_pesanan',
                $notif->order_id
            )->first();

            if (!$pesanan) {
                return response()->json([
                    'message' => 'Pesanan tidak ditemukan',
                ], 404);
            }

            $pembayaran = Pembayaran::where(
                'id_pes_fk_pb',
                $pesanan->id_pesanan
            )->first();

            if (!$pembayaran) {
                return response()->json([
                    'message' => 'Pembayaran tidak ditemukan',
                ], 404);
            }

            $statusTransaksi = match ($notif->transaction_status) {
                'capture', 'settlement' => 'berhasil',
                'pending' => 'menunggu',
                default => 'gagal',
            };

            DB::statement(
                "CALL konfirmasi_pembayaran(
                    ?, ?, ?, ?, ?, @hasil
                )",
                [
                    $pembayaran->id_pembayaran,
                    $notif->transaction_id,
                    $statusTransaksi,
                    $notif->gross_amount,
                    $signatureKey,
                ]
            );

            $hasil = DB::selectOne(
                "SELECT @hasil AS pesan"
            );

            return response()->json([
                'status' => 'ok',
                'message' => $hasil->pesan ?? 'Notifikasi diproses',
            ]);
        } catch (Throwable $e) {
            report($e);

            $message = config('app.debug')
                ? 'Gagal memproses notifikasi: ' . $e->getMessage()
                : 'Gagal memproses notifikasi pembayaran';

            return response()->json([
                'message' => $message,
            ], 500);
        }
    }
}
