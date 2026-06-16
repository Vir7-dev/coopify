<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function checkout()
    {
        $idPengguna = Auth::user()->id_pengguna;

        DB::statement(
            "CALL checkout_keranjang(
                ?,
                @kode_pesanan,
                @pesan
            )",
            [
                $idPengguna
            ]
        );

        $hasil = DB::selectOne(
            "
            SELECT
                @kode_pesanan AS kode_pesanan,
                @pesan AS pesan
            "
        );

        return response()->json([
            'kode_pesanan' => $hasil->kode_pesanan,
            'message' => $hasil->pesan
        ]);
    }
}