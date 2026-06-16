<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    public function index()
    {
        $kategori = Kategori::withCount('produk')->get()->map(function ($item) {
            return [
                'id'   => $item->id_kategori,
                'nama' => $item->nama_kategori,
                'ikon' => $item->ikon,
                'stok' => $item->produk_count,
                'tgl'  => $item->tgl_dibuat,  
            ];
        });

        return response()->json($kategori);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:100',
            'ikon'          => 'nullable|string|max:100',
        ]);

        $kategori = Kategori::create([
            'nama_kategori' => $request->nama_kategori,
            'ikon'          => $request->ikon ?? null,
        ]);

        // Kembalikan data lengkap + produk_count
        $kategori->loadCount('produk');

        return response()->json([
            'id'   => $kategori->id_kategori,
            'nama' => $kategori->nama_kategori,
            'ikon' => $kategori->ikon,
            'stok' => $kategori->produk_count,
            'tgl'  => $kategori->tgl_dibuat,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $kategori = Kategori::findOrFail($id);

        $request->validate([
            'nama_kategori' => 'required|string|max:100',
            'ikon'          => 'nullable|string|max:100',
        ]);

        $kategori->update([
            'nama_kategori' => $request->nama_kategori,
            'ikon'          => $request->ikon ?? $kategori->ikon,  
        ]);

        return response()->json([
            'id'   => $kategori->id_kategori,
            'nama' => $kategori->nama_kategori,
            'ikon' => $kategori->ikon,
            'stok' => $kategori->produk_count ?? 0,
            'tgl'  => $kategori->tgl_dibuat,
        ]);
    }

    public function destroy($id)
    {
        $kategori = Kategori::findOrFail($id);
        $kategori->delete();

        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }
}