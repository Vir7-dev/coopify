<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        // Filter berdasarkan bulan dan tahun
        if ($request->filled('bulan') && $request->filled('tahun')) {
            $query->whereMonth('tgl_pesanan', $request->bulan)
                  ->whereYear('tgl_pesanan', $request->tahun);
        }

        // Filter berdasarkan status selesai saja
        if ($request->boolean('selesai')) {
            $query->where('status_pesanan', 'selesai');
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
        \Log::info("updateStatus called for ID: $id", ['request' => $request->all()]);
        try {
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

        // Jika dibatalkan, gunakan stored procedure batalkan_pesanan
        // untuk kembalikan stok dan update status pembayaran secara otomatis
        if ($statusBaru === 'dibatalkan') {
            DB::statement('CALL batalkan_pesanan(?)', [$id]);

            return response()->json([
                'message' => "Status pesanan berhasil diupdate ke '$statusBaru'",
                'data' => Pesanan::with(['pengguna', 'detailPesanan.produk', 'pembayaran'])
                    ->findOrFail($id)
            ]);
        }

        $pesanan->save();
        \Log::info("updateStatus success for ID: $id, New Status: $statusBaru");

        return response()->json([
            'message' => "Status pesanan berhasil diupdate ke '$statusBaru'",
            'data' => $pesanan
        ]);
        } catch (\Exception $e) {
            \Log::error("updateStatus Exception: " . $e->getMessage());
            return response()->json(['message' => 'Exception: ' . $e->getMessage()], 500);
        } catch (\Error $e) {
            \Log::error("updateStatus Error: " . $e->getMessage());
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
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
