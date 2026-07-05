<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\Pembayaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
            $pembayaran->status_pem !== 'belum_bayar' ||
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

        // Auto-sync status dari Midtrans jika di localhost (tanpa ngrok)
        if (app()->isLocal() && $pembayaran->status_pem === 'belum_bayar' && $pembayaran->snap_token) {
            $this->setupMidtrans();
            try {
                $statusRes = \Midtrans\Transaction::status($pesanan->kode_pesanan);
                $statusTransaksi = match ($statusRes->transaction_status ?? '') {
                    'capture', 'settlement' => 'berhasil',
                    'pending' => 'belum_bayar',
                    'deny', 'cancel' => 'gagal',
                    'expire' => 'kadaluarsa',
                    default => 'belum_bayar',
                };

                if ($statusTransaksi !== 'belum_bayar') {
                    DB::statement(
                        "CALL konfirmasi_pembayaran(?, ?, ?, ?, ?, @hasil)",
                        [
                            $pembayaran->id_pembayaran,
                            $statusRes->transaction_id ?? 'MANUAL_SYNC',
                            $statusTransaksi,
                            $statusRes->gross_amount ?? $pesanan->total_harga,
                            'MANUAL_SYNC_NO_SIGNATURE',
                        ]
                    );
                    $pembayaran->refresh();
                }
            } catch (\Exception $e) {
                // Abaikan jika tidak ditemukan di midtrans
            }
        }

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
            // Development: gunakan payload langsung dari request
            // Production: gunakan Notification() dari Midtrans
            if (app()->environment('local')) {
                $notif = (object) $request->all();
            } else {
                $this->setupMidtrans();
                $notif = new Notification();
            }

            Log::info('Midtrans Notification', [
                'order_id' => $notif->order_id ?? $orderId,
                'transaction_status' => $notif->transaction_status ?? $request->input('transaction_status'),
                'status_code' => $notif->status_code ?? $statusCode,
                'gross_amount' => $notif->gross_amount ?? $grossAmount,
                'payment_type' => $notif->payment_type ?? $request->input('payment_type') ?? 'unknown',
            ]);

            $transactionStatus = $notif->transaction_status ?? $request->input('transaction_status', 'unknown');
            $transactionId = $notif->transaction_id ?? $request->input('transaction_id', 'unknown');

            $pesanan = Pesanan::where(
                'kode_pesanan',
                $orderId
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

            $statusTransaksi = match ($transactionStatus) {
                'capture', 'settlement' => 'berhasil',
                'pending' => 'belum_bayar',
                default => 'gagal',
            };

            Log::info('Mapped Status', [
                'original_status' => $transactionStatus,
                'mapped_status' => $statusTransaksi,
            ]);

            DB::statement(
                "CALL konfirmasi_pembayaran(
                    ?, ?, ?, ?, ?, @hasil
                )",
                [
                    $pembayaran->id_pembayaran,
                    $transactionId,
                    $statusTransaksi,
                    $grossAmount,
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
