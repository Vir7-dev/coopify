<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Gambar;

class ProdukController extends Controller
{
    private function authorizeAdmin(): void
    {
        if (!Auth::user() || Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak');
        }
    }

    public function index()
    {
        $produk = Produk::with(['kategori', 'gambar'])->get();
        return response()->json($produk);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $request->validate([
            'nama_produk' => 'required',
            'harga_jual' => 'required',
            'stok' => 'required|integer|min:0',
            'tgl_kadaluarsa' => 'required',
            'id_kat_fk_p' => 'required',
            'deskripsi' => 'required',
            'url_gambar.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ], [
            'stok.min' => 'Stok tidak boleh kurang dari 0.',
            'url_gambar.image' => 'File harus berupa gambar.',
            'url_gambar.mimes' => 'Gambar hanya boleh JPG, JPEG, atau PNG.',
            'url_gambar.max' => 'Ukuran gambar maksimal 2 MB.'
        ]);

        $data = [
            'nama_produk' => $request->nama_produk,
            'harga_jual' => $request->harga_jual,
            'stok' => $request->stok,
            'tgl_kadaluarsa' => $request->tgl_kadaluarsa,
            'id_kat_fk_p' => $request->id_kat_fk_p,
            'deskripsi' => $request->deskripsi
        ];

        $produk = Produk::create($data);

        if ($request->hasFile('url_gambar')) {
            foreach ($request->file('url_gambar') as $file) {
                $path = $file->store('produk', 'public');
                Gambar::create([
                    'url_gambar' => $path,
                    'id_prod_fk_g' => $produk->id_produk
                ]);
            }
        }

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'data' => $produk
        ], 201);
    }

    public function show($produk)
    {
        $produk = Produk::with(['kategori', 'gambar'])
            ->findOrFail($produk);

        return response()->json($produk);
    }

    public function update(Request $request, $produk)
    {
        $this->authorizeAdmin();

        $request->validate([
            'nama_produk' => 'required',
            'harga_jual' => 'required',
            'stok' => 'required|integer|min:0',
            'tgl_kadaluarsa' => 'required',
            'id_kat_fk_p' => 'required',
            'deskripsi' => 'required',
            'url_gambar.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ], [
            'stok.min' => 'Stok tidak boleh kurang dari 0.',
            'url_gambar.image' => 'File harus berupa gambar.',
            'url_gambar.mimes' => 'Gambar hanya boleh JPG, JPEG, atau PNG.',
            'url_gambar.max' => 'Ukuran gambar maksimal 2 MB.'
        ]);

        $produk = Produk::findOrFail($produk);

        $data = [
            'nama_produk' => $request->nama_produk,
            'harga_jual' => $request->harga_jual,
            'stok' => $request->stok,
            'tgl_kadaluarsa' => $request->tgl_kadaluarsa,
            'id_kat_fk_p' => $request->id_kat_fk_p,
            'deskripsi' => $request->deskripsi
        ];

        if ($request->hasFile('url_gambar')) {
            $gambarLama = Gambar::where('id_prod_fk_g', $produk->id_produk)->get();
            foreach ($gambarLama as $gambar) {
                if (Storage::disk('public')->exists($gambar->url_gambar)) {
                    Storage::disk('public')->delete($gambar->url_gambar);
                }
            }

            Gambar::where('id_prod_fk_g', $produk->id_produk)->delete();

            foreach ($request->file('url_gambar') as $file) {
                $path = $file->store('produk', 'public');

                Gambar::create([
                    'url_gambar' => $path,
                    'id_prod_fk_g' => $produk->id_produk
                ]);
            }
        }

        $produk->update($data);

        return response()->json([
            'message' => 'Produk berhasil diupdate',
            'data' => $produk
        ]);
    }

    public function destroy($produk)
    {
        $this->authorizeAdmin();

        $produk = Produk::findOrFail($produk);
        $produk->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }
}
