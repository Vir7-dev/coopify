<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;

class PembayaranController extends Controller
{
    private function setupMidtrans(): void
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function show(int $id_pesanan)
    {
        $pesanan = Pesanan::with('pembayaran')
            ->findOrFail($id_pesanan);

        $user = Auth::user();

        if ($pesanan->id_peng_fk_ps !== $user->id_pengguna) {
            abort(403, 'Akses ditolak');
        }

        if (!$pesanan->pembayaran) {
            abort(404, 'Data pembayaran tidak ditemukan');
        }

        return Inertia::render('Pembayaran', [
            'pesanan_id' => $pesanan->id_pesanan,
            'total' => $pesanan->total_harga,
            'status_pembayaran' => $pesanan->pembayaran->status_pem,
            'snap_token' => $pesanan->pembayaran->snap_token,
            'metode' => 'QRIS'
        ]);
    }

    public function createTransaction(Request $request)
    {
        $request->validate([
            'id_pesanan' => 'required|integer'
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
                'message' => 'Data pembayaran tidak ditemukan'
            ], 404);
        }

        if ($pembayaran->status_pem === 'lunas') {
            return response()->json([
                'message' => 'Pesanan sudah dibayar'
            ], 422);
        }

        if (
            $pembayaran->batas_wkt_pem &&
            now()->greaterThan($pembayaran->batas_wkt_pem)
        ) {
            $pembayaran->update([
                'status_pem' => 'kadaluarsa'
            ]);

            return response()->json([
                'message' => 'Pembayaran sudah kadaluarsa'
            ], 422);
        }

        if ($pembayaran->snap_token) {
            return response()->json([
                'snap_token' => $pembayaran->snap_token
            ]);
        }

        $this->setupMidtrans();

        $params = [
            'transaction_details' => [
                'order_id' => $pesanan->kode_pesanan,
                'gross_amount' => (int)$pesanan->total_harga
            ],
            'customer_details' => [
                'first_name' => $user->nama,
                'phone' => $user->no_hp
            ],
            'enabled_payments' => [
                'qris'
            ]
        ];

        $snapToken = Snap::getSnapToken($params);

        $pembayaran->update([
            'snap_token' => $snapToken
        ]);

        return response()->json([
            'snap_token' => $snapToken
        ]);
    }

    public function handleNotification(Request $request)
    {
        $this->setupMidtrans();

        $orderId = $request->input('order_id');
        $statusCode = $request->input('status_code');
        $grossAmount = $request->input('gross_amount');

        $expectedSignature = hash(
            'sha512',
            $orderId .
            $statusCode .
            $grossAmount .
            config('midtrans.server_key')
        );

        if (
            !hash_equals(
                $expectedSignature,
                $request->input('signature_key')
            )
        ) {
            return response()->json([
                'message' => 'Signature tidak valid'
            ], 403);
        }

        $notif = new Notification();

        $pesanan = Pesanan::where(
            'kode_pesanan',
            $notif->order_id
        )->first();

        if (!$pesanan) {
            return response()->json([
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        $pembayaran = Pembayaran::where(
            'id_pes_fk_pb',
            $pesanan->id_pesanan
        )->first();

        if (!$pembayaran) {
            return response()->json([
                'message' => 'Pembayaran tidak ditemukan'
            ], 404);
        }

        $statusTransaksi = match ($notif->transaction_status) {
            'capture', 'settlement' => 'berhasil',
            'pending' => 'menunggu',
            default => 'gagal'
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
                $request->input('signature_key')
            ]
        );

        $hasil = DB::selectOne(
            "SELECT @hasil AS pesan"
        );

        return response()->json([
            'status' => 'ok',
            'message' => $hasil->pesan
        ]);
    }
}