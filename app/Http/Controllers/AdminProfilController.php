<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Produk;
use App\Models\Kategori;
use App\Models\Pesanan;

class AdminProfilController extends Controller
{
    /**
     * GET /api/admin/profil
     * Ambil profil admin + statistik dashboard
     */
    public function index()
    {
        $user = Auth::user();

        // Guard: hanya admin
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // ---- Statistik ----
        $totalProduk    = Produk::count();
        $totalKategori  = Kategori::count();
        $pesananMasuk   = Pesanan::whereIn('status_pesanan', ['menunggu', 'diproses'])->count();
        $pesananSelesai = Pesanan::where('status_pesanan', 'selesai')->count();

        return response()->json([
            'profil' => [
                'nama'        => $user->nama,
                'nim_nik'     => $user->nim_nik,
                'email'       => $user->email,
                'no_hp'       => $user->no_hp,
                'foto_profil' => $user->foto_profil
                    ? asset('storage/' . $user->foto_profil)
                    : null,
                'role'        => $user->role === 'admin' ? 'Administrator' : 'Pengguna',
                'status'      => 'Aktif',
                'login_terakhir' => $user->updated_at
                    ? \Carbon\Carbon::parse($user->updated_at)
                        ->locale('id')
                        ->translatedFormat('d M Y, H:i')
                    : '-',
            ],
            'statistik' => [
                'total_produk'    => $totalProduk,
                'total_kategori'  => $totalKategori,
                'pesanan_masuk'   => $pesananMasuk,
                'pesanan_selesai' => $pesananSelesai,
            ],
        ]);
    }

    /**
     * PUT /api/admin/profil
     * Update data profil admin
     */
    public function update(Request $request)
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    /** @var \App\Models\User $user */
    $user = Auth::user();

    if ($user->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $request->validate([
        'nama'        => 'sometimes|string|max:100',
        'no_hp'       => 'sometimes|string|max:20',
        'email'       => 'sometimes|email|unique:pengguna,email,' . $user->id_pengguna . ',id_pengguna',
        'password'    => 'sometimes|string|min:8|confirmed',
        'foto_profil' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $data = $request->only(['nama', 'no_hp', 'email']);

    if ($request->filled('password')) {
        $data['password'] = Hash::make($request->password);
    }

    if ($request->hasFile('foto_profil')) {
        if ($user->foto_profil) {
            Storage::disk('public')->delete($user->foto_profil);
        }
        $path = $request->file('foto_profil')->store('foto', 'public');
        $data['foto_profil'] = $path;
    }

    $data['updated_at'] = now();

    // Pakai DB::table langsung untuk hindari warning Intelephense
    DB::table('pengguna')
        ->where('id_pengguna', $user->id_pengguna)
        ->update($data);

    // Ambil data terbaru langsung dari DB
    $updatedUser = DB::table('pengguna')
        ->where('id_pengguna', $user->id_pengguna)
        ->first();

    return response()->json([
        'message' => 'Profil berhasil diperbarui',
        'profil'  => [
            'nama'        => $updatedUser->nama,
            'no_hp'       => $updatedUser->no_hp,
            'email'       => $updatedUser->email,
            'foto_profil' => $updatedUser->foto_profil
                ? asset('storage/' . $updatedUser->foto_profil)
                : null,
        ],
    ]);
}
}