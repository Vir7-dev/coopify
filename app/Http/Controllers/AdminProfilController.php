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
        $pesananMasuk   = Pesanan::whereIn('status_pesanan', ['belum bayar', 'diproses'])->count();
        $pesananSelesai = Pesanan::where('status_pesanan', 'selesai')->count();

        // Hitung total pemasukan dari pesanan yang sudah lunas
        $totalPemasukan = DB::table('pembayaran')
            ->where('status_pem', 'lunas')
            ->sum('total_bayar');

        // Hitung total transaksi
        $totalTransaksi = Pesanan::whereIn('status_pesanan', ['selesai', 'belum bayar', 'diproses'])->count();

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
                'total_pemasukan' => $totalPemasukan,
                'total_transaksi' => $totalTransaksi,
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

    /**
     * GET /api/admin/chart
     * Ambil data grafik penjualan per hari dalam sebulan
     * Opsional: filter berdasarkan minggu (1-5)
     */
    public function chartData(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $tahun = $request->input('tahun', date('Y'));
        $bulan = $request->input('bulan', date('m'));
        $minggu = $request->input('minggu'); // 1-5, null = semua minggu

        // Format nama bulan Indonesia
        $namaBulan = [
            '01' => 'Januari', '02' => 'Februari', '03' => 'Maret',
            '04' => 'April', '05' => 'Mei', '06' => 'Juni',
            '07' => 'Juli', '08' => 'Agustus', '09' => 'September',
            '10' => 'Oktober', '11' => 'November', '12' => 'Desember'
        ];

        // Query builder untuk pesanan selesai
        $queryBuilder = DB::table('pesanan as p')
            ->join('pembayaran as pm', 'pm.id_pes_fk_pb', '=', 'p.id_pesanan')
            ->where('p.status_pesanan', 'selesai')
            ->whereYear('p.tgl_pesanan', $tahun)
            ->whereMonth('p.tgl_pesanan', $bulan);

        // Filter berdasarkan minggu jika specified
        if ($minggu !== null && is_numeric($minggu)) {
            $weekNumber = (int) $minggu;
            // Hitung tanggal mulai dan akhir minggu
            $startDate = date("Y-m-d", strtotime("{$tahun}-{$bulan}-01 +" . (($weekNumber - 1) * 7) . " days"));
            $endDate = date("Y-m-d", strtotime("{$tahun}-{$bulan}-01 +" . ($weekNumber * 7 - 1) . " days"));

            // Pastikan tidak melebihi akhir bulan
            $lastDayOfMonth = date("t", strtotime("{$tahun}-{$bulan}-01"));
            $endDate = min($endDate, "{$tahun}-{$bulan}-{$lastDayOfMonth}");

            $queryBuilder->whereBetween('p.tgl_pesanan', [$startDate, $endDate . ' 23:59:59']);
        }

        // Ambil data penjualan per hari dalam bulan/minggu yang dipilih
        $penjualanPerHari = (clone $queryBuilder)
            ->select(
                DB::raw('DAYOFWEEK(p.tgl_pesanan) as hari_ke'),
                DB::raw('COUNT(*) as total_transaksi'),
                DB::raw('SUM(p.total_harga) as total_penjualan')
            )
            ->groupBy(DB::raw('DAYOFWEEK(p.tgl_pesanan)'))
            ->get();

        // Nama hari dalam bahasa Indonesia
        $namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

        // Inisialisasi data untuk 7 hari
        $dataPerHari = [];
        for ($i = 1; $i <= 7; $i++) {
            $dataPerHari[$i] = 0;
        }

        // Map data dari database
        foreach ($penjualanPerHari as $data) {
            $dataPerHari[$data->hari_ke] = (int) $data->total_transaksi;
        }

        // Hitung total transaksi dan pemasukan untuk periode yang dipilih
        $statistikPeriode = (clone $queryBuilder)
            ->select(
                DB::raw('COUNT(*) as total_transaksi'),
                DB::raw('COALESCE(SUM(p.total_harga), 0) as total_pemasukan')
            )
            ->first();

        // Hitung jumlah minggu dalam bulan ini
        $lastDayOfMonth = date("t", strtotime("{$tahun}-{$bulan}-01"));
        $jumlahMinggu = ceil($lastDayOfMonth / 7);

        return response()->json([
            'labels' => $namaHari,
            'datasets' => [
                [
                    'label' => 'Penjualan',
                    'data' => array_values($dataPerHari),
                    'backgroundColor' => '#1766D3',
                    'borderRadius' => 8
                ]
            ],
            'bulan' => $namaBulan[$bulan] ?? $bulan,
            'tahun' => $tahun,
            'statistik' => [
                'total_transaksi' => (int) $statistikPeriode->total_transaksi,
                'total_pemasukan' => (float) $statistikPeriode->total_pemasukan
            ],
            'minggu' => $minggu ? (int) $minggu : null,
            'jumlah_minggu' => $jumlahMinggu
        ]);
    }
}