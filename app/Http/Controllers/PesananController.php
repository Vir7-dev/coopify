<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Illuminate\Http\Request;

class PesananController extends Controller
{
    /**
     * Ambil semua pesanan (opsional filter status)
     * GET /admin/pesanan
     */
    public function index(Request $request)
    {
        $query = Pesanan::with(['pengguna', 'detailPesanan.produk', 'pembayaran'])
            ->orderBy('tgl_pesanan', 'desc');

        // Filter berdasarkan status
        if ($request->filled('status')) {
            $query->where('status_pesanan', $request->status);
        }

        // Filter pesanan baru (menunggu) untuk notifikasi
        if ($request->boolean('baru')) {
            $query->where('status_pesanan', 'menunggu');
        }

        $pesanan = $query->get();

        return response()->json($pesanan);
    }

    /**
     * Ambil satu pesanan
     * GET /admin/pesanan/{id}
     */
    public function show($id)
    {
        $pesanan = Pesanan::with(['pengguna', 'detailPesanan.produk', 'pembayaran'])
            ->findOrFail($id);

        return response()->json($pesanan);
    }

    /**
     * Update status pesanan
     * PUT /admin/pesanan/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:menunggu,diproses,siap diambil,selesai,dibatalkan'
        ]);

        $pesanan = Pesanan::findOrFail($id);

        $statusLama = $pesanan->status_pesanan;
        $statusBaru = $request->status;

        // Validasi transisi status
        $validTransitions = [
            'menunggu' => ['diproses', 'dibatalkan'],
            'diproses' => ['siap diambil', 'dibatalkan'],
            'siap diambil' => ['selesai', 'dibatalkan'],
            'selesai' => [],
            'dibatalkan' => [],
        ];

        if (!in_array($statusBaru, $validTransitions[$statusLama] ?? [])) {
            return response()->json([
                'message' => "Tidak bisa mengubah status dari '$statusLama' ke '$statusBaru'"
            ], 422);
        }

        $pesanan->status_pesanan = $statusBaru;

        // Jika dibatalkan, kembalikan stok
        if ($statusBaru === 'dibatalkan') {
            foreach ($pesanan->detailPesanan as $detail) {
                $detail->produk->increment('stok', $detail->jml_peritem);
            }
        }

        $pesanan->save();

        return response()->json([
            'message' => "Status pesanan berhasil diupdate ke '$statusBaru'",
            'data' => $pesanan
        ]);
    }

    /**
     * Hitung pesanan baru (untuk notifikasi badge)
     * GET /admin/pesanan/count
     */
    public function countBaru()
    {
        $count = Pesanan::where('status_pesanan', 'menunggu')->count();

        return response()->json(['count' => $count]);
    }
}
