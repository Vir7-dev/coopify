<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KategoriController extends Controller
{
    private function authorizeAdmin(): void
    {
        if (!Auth::user() || Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak');
        }
    }

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
        $this->authorizeAdmin();

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
        $this->authorizeAdmin();

        $kategori = Kategori::findOrFail($id);

        $request->validate([
            'nama_kategori' => 'required|string|max:100',
            'ikon'          => 'nullable|string|max:100',
        ]);

        $kategori->update([
            'nama_kategori' => $request->nama_kategori,
            'ikon'          => $request->ikon ?? $kategori->ikon,
        ]);

        // ✅ Tambah ini — sama seperti di store()
        $kategori->loadCount('produk');

        return response()->json([
            'id'   => $kategori->id_kategori,
            'nama' => $kategori->nama_kategori,
            'ikon' => $kategori->ikon,
            'stok' => $kategori->produk_count,
            'tgl'  => $kategori->tgl_dibuat,
        ]);
    }

    public function destroy($id)
    {
        $this->authorizeAdmin();

        $kategori = Kategori::findOrFail($id);
        $kategori->delete();

        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }
}
