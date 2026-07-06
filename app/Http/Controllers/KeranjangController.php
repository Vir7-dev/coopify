<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class KeranjangController extends Controller
{
    public function index()
    {
        $items = Keranjang::with([
            'produk.gambar',
            'produk.kategori',
            'produk.diskon'
        ])
            ->where(
                'id_peng_fk_k',
                Auth::user()->id_pengguna
            )
            ->get();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_produk' => 'required|integer',
            'jumlah' => 'required|integer|min:1'
        ]);

        $produk = Produk::findOrFail($request->id_produk);

        // Cek stok menggunakan stored function cek_stok_tersedia
        $stokCukup = DB::selectOne(
            'SELECT cek_stok_tersedia(?, ?) AS hasil',
            [$request->id_produk, $request->jumlah]
        );

        if (!$stokCukup->hasil) {
            return response()->json([
                'message' => 'Stok tidak mencukupi'
            ], 400);
        }

        $keranjang = Keranjang::where(
            'id_peng_fk_k',
            Auth::user()->id_pengguna
        )
            ->where(
                'id_prod_fk_k',
                $produk->id_produk
            )
            ->first();

        if ($keranjang) {

            $keranjang->increment(
                'jml_dikeranjang',
                $request->jumlah
            );
        } else {

            Keranjang::create([
                'id_peng_fk_k' => Auth::user()->id_pengguna,
                'id_prod_fk_k' => $produk->id_produk,
                'jml_dikeranjang' => $request->jumlah
            ]);
        }

        return response()->json([
            'message' => 'Produk berhasil ditambahkan ke keranjang'
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'jumlah' => 'required|integer|min:1'
        ]);

        $keranjang = Keranjang::findOrFail($id);

        if (
            $keranjang->id_peng_fk_k
            != Auth::user()->id_pengguna
        ) {
            abort(403);
        }

        $keranjang->update([
            'jml_dikeranjang' => $request->jumlah
        ]);

        return response()->json([
            'message' => 'Keranjang diperbarui'
        ]);
    }

    public function destroy($id)
    {
        $keranjang = Keranjang::findOrFail($id);

        if (
            $keranjang->id_peng_fk_k
            != Auth::user()->id_pengguna
        ) {
            abort(403);
        }

        $keranjang->delete();

        return response()->json([
            'message' => 'Item dihapus dari keranjang'
        ]);
    }
}
