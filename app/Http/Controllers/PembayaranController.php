<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;
use App\Models\Pesanan;
use Inertia\Inertia;

class PembayaranController extends Controller
{
    private function setupMidtrans(): void
    {
        Config::$serverKey    = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized  = true;
        Config::$is3ds        = true;
    }

    // ─────────────────────────────────────────
    // Halaman pembayaran
    // ─────────────────────────────────────────
    public function show($id_pesanan)
    {
        $pesanan = Pesanan::with('detailPesanan.produk')->findOrFail($pesananId);

        // FIX #1 — Validasi kepemilikan
        if ($pesanan->id_pengguna !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        return Inertia::render('Pembayaran', [
            'total'      => $pesanan->total,
            'metode'     => 'QRIS',
            'pesanan_id' => $pesanan->id,
            'snap_token' => $pesanan->snap_token,
        ]);
    }

    // ─────────────────────────────────────────
    // Buat snap token
    // ─────────────────────────────────────────
    public function createTransaction(Request $request)
    {
        $request->validate(['id_pesanan' => 'required|integer']);

        $pesanan = Pesanan::with('detailPesanan.produk')->findOrFail($request->id_pesanan);

        // FIX #1 — Validasi kepemilikan
        if ($pesanan->id_pengguna !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        // FIX #3 — Cegah buat token kalau sudah paid/cancelled
        if (in_array($pesanan->status, ['paid', 'cancelled'])) {
            return response()->json([
                'message' => 'Pesanan sudah ' . $pesanan->status . ', tidak bisa membuat transaksi baru.',
            ], 422);
        }

        // Kalau sudah ada snap_token (misal user refresh), reuse saja
        if ($pesanan->snap_token) {
            return response()->json(['snap_token' => $pesanan->snap_token]);
        }

        // FIX #2 — Hitung ulang total dari detail item, bukan dari kolom total
        $totalDihitung = $pesanan->detailPesanan->sum(function ($item) {
            return $item->harga_saat_pesan * $item->jumlah;
        });

        // Kalau ada diskon di pesanan, kurangi
        if ($pesanan->diskon_nominal) {
            $totalDihitung -= $pesanan->diskon_nominal;
        }

        $totalDihitung = max(0, (int) $totalDihitung);

        $this->setupMidtrans();

        $params = [
            'transaction_details' => [
                'order_id'    => $pesanan->kode_pesanan,
                'gross_amount' => $totalDihitung,
            ],
            'customer_details' => [
                'first_name' => auth()->user()->nama,
                'email'      => auth()->user()->email,
            ],
            'enabled_payments' => ['qris'],
        ];

        $snapToken = Snap::getSnapToken($params);

        $pesanan->update([
            'snap_token' => $snapToken,
            'status'     => 'pending',
        ]);

        return response()->json(['snap_token' => $snapToken]);
    }

    // ─────────────────────────────────────────
    // Webhook Midtrans
    // ─────────────────────────────────────────
    public function handleNotification(Request $request)
    {
        $this->setupMidtrans();

        // FIX #4 — Verifikasi signature Midtrans
        // Format: SHA512(order_id + status_code + gross_amount + server_key)
        $orderId     = $request->input('order_id');
        $statusCode  = $request->input('status_code');
        $grossAmount = $request->input('gross_amount');
        $serverKey   = config('midtrans.server_key');

        $signatureInput    = $orderId . $statusCode . $grossAmount . $serverKey;
        $expectedSignature = hash('sha512', $signatureInput);
        $receivedSignature = $request->input('signature_key');

        if (!hash_equals($expectedSignature, $receivedSignature)) {
            return response()->json(['message' => 'Signature tidak valid.'], 403);
        }

        // Proses notifikasi
        $notif  = new Notification();
        $status = $notif->transaction_status;
        $fraud  = $notif->fraud_status;

        $pesanan = Pesanan::where('kode_pesanan', $orderId)->firstOrFail();

        if ($status === 'capture') {
            $pesanan->update([
                'status' => $fraud === 'challenge' ? 'challenge' : 'paid',
            ]);
        } elseif ($status === 'settlement') {
            $pesanan->update(['status' => 'paid']);
        } elseif (in_array($status, ['cancel', 'deny', 'expire'])) {
            $pesanan->update(['status' => 'cancelled']);
        } elseif ($status === 'pending') {
            $pesanan->update(['status' => 'pending']);
        }

        return response()->json(['status' => 'ok']);
    }
}