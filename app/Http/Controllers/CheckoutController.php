<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $idPengguna = $user->id_pengguna;
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*' => ['integer'],
            'wkt_pengambilan' => ['required', 'date'],
        ]);

        $selectedKeranjangIds = collect($validated['items'])
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values()
            ->all();
        $waktuPengambilan = Carbon::parse($validated['wkt_pengambilan'])
            ->format('Y-m-d H:i:s');

        try {
            $hasil = DB::transaction(function () use ($idPengguna, $selectedKeranjangIds, $waktuPengambilan) {
                $keranjangItems = DB::table('keranjang as k')
                    ->join('produk as p', 'p.id_produk', '=', 'k.id_prod_fk_k')
                    ->leftJoin('diskon as d', 'd.id_diskon', '=', 'p.id_disk_fk_p')
                    ->where('k.id_peng_fk_k', $idPengguna)
                    ->whereIn('k.id_keranjang', $selectedKeranjangIds)
                    ->select([
                        'k.id_keranjang',
                        'k.jml_dikeranjang',
                        'p.id_produk',
                        'p.stok',
                        'p.harga_jual',
                        DB::raw('COALESCE(d.harga_diskon, 0) as harga_diskon'),
                    ])
                    ->lockForUpdate()
                    ->get();

                if ($keranjangItems->count() !== count($selectedKeranjangIds)) {
                    return [
                        'status' => false,
                        'message' => 'Gagal: beberapa item checkout tidak valid',
                    ];
                }

                $stokTidakCukup = $keranjangItems->contains(
                    fn ($item) => (int) $item->jml_dikeranjang > (int) $item->stok
                );

                if ($stokTidakCukup) {
                    return [
                        'status' => false,
                        'message' => 'Gagal: terdapat produk dengan stok tidak mencukupi',
                    ];
                }

                $totalHarga = $keranjangItems->sum(function ($item) {
                    return ((float) $item->harga_jual - (float) $item->harga_diskon) * (int) $item->jml_dikeranjang;
                });

                do {
                    $suffix = Str::upper(Str::random(6));
                } while (
                    !preg_match('/[A-Z]/', $suffix) ||
                    !preg_match('/\d/', $suffix) ||
                    DB::table('pesanan')
                        ->where('kode_pesanan', 'ORD-' . $suffix)
                        ->exists()
                );

                $kodePesanan = 'ORD-' . $suffix;

                $idPesanan = DB::table('pesanan')->insertGetId([
                    'kode_pesanan' => $kodePesanan,
                    'tgl_pesanan' => now(),
                    'wkt_pengambilan' => $waktuPengambilan,
                    'total_harga' => $totalHarga,
                    'status_pesanan' => 'belum bayar',
                    'id_peng_fk_ps' => $idPengguna,
                ]);

                $detailRows = $keranjangItems->map(function ($item) use ($idPesanan) {
                    return [
                        'jml_peritem' => (int) $item->jml_dikeranjang,
                        'harga_saat_pesan' => (float) $item->harga_jual,
                        'diskon_saat_pesan' => (float) $item->harga_diskon,
                        'subtotal_dp' => ((float) $item->harga_jual - (float) $item->harga_diskon) * (int) $item->jml_dikeranjang,
                        'id_pes_fk_dp' => $idPesanan,
                        'id_prod_fk_dp' => (int) $item->id_produk,
                    ];
                })->all();

                DB::table('detail_pesanan')->insert($detailRows);

                $qtyPerProduk = $keranjangItems
                    ->groupBy('id_produk')
                    ->map(fn ($rows) => $rows->sum('jml_dikeranjang'));

                foreach ($qtyPerProduk as $idProduk => $qty) {
                    DB::table('produk')
                        ->where('id_produk', (int) $idProduk)
                        ->decrement('stok', (int) $qty);
                }

                DB::table('pembayaran')->insert([
                    'status_pem' => 'belum_bayar',
                    'total_bayar' => $totalHarga,
                    'batas_wkt_pem' => now()->addMinutes(
                        config('coopify.payment_timeout_minutes')
                    ),
                    'id_pes_fk_pb' => $idPesanan,
                ]);

                DB::table('keranjang')
                    ->where('id_peng_fk_k', $idPengguna)
                    ->whereIn('id_keranjang', $selectedKeranjangIds)
                    ->delete();

                return [
                    'status' => true,
                    'id_pesanan' => $idPesanan,
                    'kode_pesanan' => $kodePesanan,
                    'wkt_pengambilan' => $waktuPengambilan,
                    'total_harga' => $totalHarga,
                    'message' => 'Berhasil: checkout berhasil',
                ];
            });
        } catch (\Throwable $e) {
            report($e);

            $message = config('app.debug')
                ? ('Gagal: ' . $e->getMessage())
                : 'Gagal: transaksi dibatalkan';

            return response()->json([
                'message' => $message
            ], 500);
        }

        if (!$hasil['status']) {
            return response()->json([
                'message' => $hasil['message']
            ], 422);
        }

        return response()->json([
            'kode_pesanan' => $hasil['kode_pesanan'],
            'id_pesanan' => $hasil['id_pesanan'],
            'wkt_pengambilan' => $hasil['wkt_pengambilan'],
            'total_harga' => $hasil['total_harga'],
            'message' => $hasil['message']
        ]);
    }
}
