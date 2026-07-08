<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Gambar;
use App\Models\Diskon;

class ProdukController extends Controller
{
    public function index(Request $request)
    {

        $produk = Produk::with(['kategori', 'gambar', 'diskon'])
            ->withSum([
                'detailPesanan as terjual' => function ($q) {
                    $q->whereHas('pesanan', function ($query) {
                        $query->where('status_pesanan', 'selesai');
                    });
                }
            ], 'jml_peritem')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($produk);
    }

    // ================= SEARCH =================
    public function search(Request $request)
    {
        $keyword = $request->q ?? '';
        $perPage = $request->input('per_page', 12);
        $perPage = min(max((int)$perPage, 1), 50);

        $query = Produk::with(['kategori', 'gambar', 'diskon'])
            ->where('nama_produk', 'like', '%' . addcslashes($keyword, '%_') . '%');

        // Filter kategori jika ada
        if ($request->filled('kategori')) {
            $query->where('id_kat_fk_p', $request->kategori);
        }

        $produk = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($produk);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|unique:produk,nama_produk',
            'harga_jual' => 'required',
            'persen_diskon' => 'nullable|numeric|min:0|max:100',
            'id_kat_fk_p' => 'required',
            'deskripsi' => 'required',
            'url_gambar.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ], [
            // Wajib diisi
            'nama_produk.required' => 'Nama produk wajib diisi.',
            'nama_produk.unique' => 'Nama produk sudah digunakan.',
            'harga_jual.required' => 'Harga produk wajib diisi.',
            'id_kat_fk_p.required' => 'Kategori wajib dipilih.',
            'deskripsi.required' => 'Deskripsi produk wajib diisi.',

            // Diskon
            'persen_diskon.min' => 'Persen diskon tidak boleh kurang dari 0.',
            'persen_diskon.max' => 'Persen diskon tidak boleh lebih dari 100.',

            // Stok
            'stok.min' => 'Stok tidak boleh kurang dari 0.',

            // Gambar
            'url_gambar.*.image' => 'File harus berupa gambar.',
            'url_gambar.*.mimes' => 'Gambar hanya boleh JPG, JPEG, atau PNG.',
            'url_gambar.*.max' => 'Ukuran gambar maksimal 2 MB.'
        ]);

        $diskon = null;

        if ($request->persen_diskon > 0) {

            $diskon = Diskon::firstOrCreate([
                'persen_diskon' => $request->persen_diskon
            ]);
        }

        $data = [
            'nama_produk' => $request->nama_produk,
            'harga_jual' => $request->harga_jual,
            'stok' => $request->stok ?? 0,
            'id_disk_fk_p' => $diskon?->id_diskon,
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
        $produk = Produk::with(['kategori', 'gambar', 'diskon'])
            ->withSum([
                'detailPesanan as terjual' => function ($q) {
                    $q->whereHas('pesanan', function ($query) {
                        $query->where('status_pesanan', 'selesai');
                    });
                }
            ], 'jml_peritem')
            ->findOrFail($produk);

        return response()->json($produk);
    }

    public function update(Request $request, $produk)
    {
        $request->validate([
            'nama_produk' => 'required|unique:produk,nama_produk,' . $produk . ',id_produk',
            'harga_jual' => 'required',
            'stok' => 'nullable|integer|min:0',
            'persen_diskon' => 'nullable|numeric|min:0|max:100',
            'id_kat_fk_p' => 'required',
            'deskripsi' => 'required',
            'url_gambar.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ], [
            // Wajib diisi
            'nama_produk.required' => 'Nama produk wajib diisi.',
            'nama_produk.unique' => 'Nama produk sudah digunakan.',
            'harga_jual.required' => 'Harga produk wajib diisi.',
            'id_kat_fk_p.required' => 'Kategori wajib dipilih.',
            'deskripsi.required' => 'Deskripsi produk wajib diisi.',

            // Diskon
            'persen_diskon.integer' => 'Persen diskon harus berupa angka bulat.',
            'persen_diskon.min' => 'Persen diskon tidak boleh kurang dari 0.',
            'persen_diskon.max' => 'Persen diskon tidak boleh lebih dari 100.',

            // Stok
            'stok.min' => 'Stok tidak boleh kurang dari 0.',

            // Gambar
            'url_gambar.*.image' => 'File harus berupa gambar.',
            'url_gambar.*.mimes' => 'Gambar hanya boleh berformat JPG, JPEG, atau PNG.',
            'url_gambar.*.max' => 'Ukuran gambar maksimal 2 MB.',
        ]);

        $produk = Produk::findOrFail($produk);

        $diskon = null;

        if ($request->persen_diskon > 0) {

            $diskon = Diskon::firstOrCreate([
                'persen_diskon' => $request->persen_diskon
            ]);
        }

        $data = [
            'nama_produk' => $request->nama_produk,
            'harga_jual' => $request->harga_jual,
            'stok' => $request->stok ?? 0,
            'id_disk_fk_p' => $diskon?->id_diskon,
            'id_kat_fk_p' => $request->id_kat_fk_p,
            'deskripsi' => $request->deskripsi
        ];

        $produk->update($data);

        return response()->json([
            'message' => 'Produk berhasil diupdate',
            'data' => $produk
        ]);
    }

    public function destroy($produk)
    {
        $produk = Produk::findOrFail($produk);
        $produk->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }

    public function tambahStok(Request $request)
    {

        $request->validate([
            'id_produk' => 'required|exists:produk,id_produk',
            'jumlah_tambah' => 'required|integer|min:1',
        ], [
            'jumlah_tambah.min' => 'Jumlah tambah stok minimal 1.',
        ]);

        $produk = Produk::findOrFail($request->id_produk);

        $produk->stok += $request->jumlah_tambah;

        $produk->save();

        return response()->json([
            'message' => 'Stok berhasil ditambahkan',
            'data' => $produk
        ]);
    }
}
