<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Pesanan;

class ProfilPenggunaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Dapatkan semua riwayat pesanan
        // Kami menggunakan Eager Loading untuk menghindari query N+1
        $pesanans = Pesanan::with(['detailPesanan.produk.gambar', 'detailPesanan.produk.kategori', 'pembayaran'])
            ->where('id_peng_fk_ps', $user->id_pengguna)
            ->orderBy('tgl_pesanan', 'desc')
            ->get();

        // 2. Hitung statistik
        // Total Pesanan dihitung khusus dari pesanan yang sudah selesai
        $totalPesanan = $pesanans->where('status_pesanan', 'selesai')->count();

        // Menghitung Total Belanja menggunakan stored function hitung_total_belanja
        // Function ini menghitung total belanja pengguna dari pesanan yang sudah lunas
        $totalBelanja = DB::selectOne(
            'SELECT hitung_total_belanja(?) AS total',
            [$user->id_pengguna]
        )->total ?? 0;

        // Menghitung Pesanan yang Sedang Diproses dan Siap Diambil
        $siapDiambil = $pesanans->whereIn('status_pesanan', ['diproses', 'siap diambil'])->count();

        // 3. Format riwayat pesanan agar sesuai dengan frontend
        // Menampilkan semua riwayat pesanan (yang sudah dibayar/diproses/selesai)
        $riwayat = [];
        // Menampilkan semua status pesanan di riwayat
        foreach ($pesanans as $pesanan) {
            foreach ($pesanan->detailPesanan as $detail) {
                // Cari gambar pertama, atau fallback ke default
                $gambarUrl = "/img/default.png";
                if ($detail->produk && $detail->produk->gambar->count() > 0) {
                    $gambarUrl = asset('storage/' . $detail->produk->gambar->first()->url_gambar);
                }

                $riwayat[] = [
                    'id' => $detail->id_detail,
                    'id_pesanan' => $pesanan->id_pesanan,
                    'kode_pesanan' => $pesanan->kode_pesanan,
                    'nama' => $detail->produk ? $detail->produk->nama_produk : 'Produk Tidak Ditemukan',
                    'kategori' => ($detail->produk && $detail->produk->kategori) ? $detail->produk->kategori->nama_kategori : 'Kategori',
                    'harga' => (float) $detail->harga_saat_pesan,
                    'jumlah' => $detail->jml_peritem,
                    'tgl' => $pesanan->tgl_pesanan ? $pesanan->tgl_pesanan->format('Y-m-d') : null,
                    'status' => $pesanan->status_pesanan,
                    'gambar' => $gambarUrl,
                ];
            }
        }

        // 4. Dapatkan pesanan yang belum dibayar (status_pem = 'menunggu')
        $pesananBelumBayar = [];
        $pesananPending = $pesanans->filter(function ($pesanan) {
            return $pesanan->pembayaran &&
                   $pesanan->pembayaran->status_pem === 'belum_bayar' &&
                   ($pesanan->pembayaran->batas_wkt_pem === null || now()->lessThan($pesanan->pembayaran->batas_wkt_pem));
        });

        foreach ($pesananPending as $pesanan) {
            $pembayaran = $pesanan->pembayaran;

            // Auto-sync status dari Midtrans jika di localhost (tanpa ngrok)
            if (app()->isLocal() && $pembayaran->snap_token) {
                \Midtrans\Config::$serverKey = config('midtrans.server_key');
                \Midtrans\Config::$isProduction = config('midtrans.is_production');
                \Midtrans\Config::$isSanitized = true;
                \Midtrans\Config::$is3ds = true;
                
                try {
                    $statusRes = \Midtrans\Transaction::status($pesanan->kode_pesanan);
                    $statusTransaksi = match ($statusRes->transaction_status ?? '') {
                        'capture', 'settlement' => 'lunas',
                        'pending'              => 'belum_bayar',
                        'expire'               => 'kadaluarsa',
                        'deny', 'cancel'       => 'gagal',
                        default                => 'gagal',
                    };

                    if ($statusTransaksi !== 'belum_bayar') {
                        DB::statement(
                            "CALL konfirmasi_pembayaran(?, ?, ?, ?, ?, @hasil)",
                            [
                                $pembayaran->id_pembayaran,
                                $statusRes->transaction_id ?? 'MANUAL_SYNC',
                                $statusTransaksi,
                                $statusRes->gross_amount ?? $pesanan->total_harga,
                                'MANUAL_SYNC_NO_SIGNATURE',
                            ]
                        );
                        $pembayaran->refresh();
                        $pesanan->refresh();
                        
                        // Jika statusnya sudah tidak menunggu, lewati dari daftar belum bayar
                        if ($pembayaran->status_pem !== 'belum_bayar') {
                            continue;
                        }
                    }
                } catch (\Exception $e) {
                    // Abaikan jika tidak ditemukan di midtrans
                }
            }

            $totalItems = $pesanan->detailPesanan->sum('jml_peritem');
            $listProduk = $pesanan->detailPesanan->map(function ($detail) {
                return $detail->produk ? $detail->produk->nama_produk : 'Produk Tidak Ditemukan';
            })->toArray();

            $pesananBelumBayar[] = [
                'id_pesanan' => $pesanan->id_pesanan,
                'kode_pesanan' => $pesanan->kode_pesanan,
                'total_harga' => (float) $pesanan->total_harga,
                'total_items' => $totalItems,
                'produk_names' => implode(', ', $listProduk),
                'wkt_pengambilan' => $pesanan->wkt_pengambilan ? $pesanan->wkt_pengambilan->format('Y-m-d H:i') : null,
                'batas_wkt_pem' => $pembayaran->batas_wkt_pem ? $pembayaran->batas_wkt_pem->toIso8601String() : null,
                'tgl_pesanan' => $pesanan->tgl_pesanan ? $pesanan->tgl_pesanan->format('Y-m-d H:i:s') : null,
            ];
        }

        return response()->json([
            'user' => [
                'id_pengguna' => $user->id_pengguna,
                'nama' => $user->nama,
                'nim_nik' => $user->nim_nik,
                'no_hp' => $user->no_hp,
                'email' => $user->email,
                'role' => $user->role,
                'foto_profil' => $user->foto_profil ? '/storage/' . $user->foto_profil : null,
            ],
            'statistik' => [
                'total_pesanan' => $totalPesanan,
                'total_belanja' => (float) $totalBelanja,
                'siap_diambil' => $siapDiambil,
            ],
            'riwayat' => $riwayat,
            'pesanan_belum_bayar' => $pesananBelumBayar,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'email' => 'required|email|unique:pengguna,email,' . $user->id_pengguna . ',id_pengguna',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $user->nama = $request->nama;
        $user->no_hp = $request->no_hp;
        $user->email = $request->email;

        // Handle file upload
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada (opsional, tapi baik untuk menghemat storage)
            if ($user->foto_profil && Storage::disk('public')->exists($user->foto_profil)) {
                Storage::disk('public')->delete($user->foto_profil);
            }

            $path = $request->file('foto')->store('profil', 'public');
            $user->foto_profil = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => [
                'id_pengguna' => $user->id_pengguna,
                'nama' => $user->nama,
                'nim_nik' => $user->nim_nik,
                'no_hp' => $user->no_hp,
                'email' => $user->email,
                'role' => $user->role,
                'foto_profil' => $user->foto_profil ? '/storage/' . $user->foto_profil : null,
            ]
        ]);
    }

    /**
     * Ambil notifikasi untuk pengguna yang sedang login
     * GET /api/profil-pengguna/notifikasi
     */
    public function notifikasi(Request $request)
    {
        $user = $request->user();

        // Ambil pesanan yang statusnya 'siap diambil' atau 'diproses' untuk notifikasi
        $pesanans = Pesanan::with(['detailPesanan.produk'])
            ->where('id_peng_fk_ps', $user->id_pengguna)
            ->whereIn('status_pesanan', ['diproses', 'siap diambil'])
            ->orderBy('wkt_pengambilan', 'asc')
            ->get();

        $notifikasi = [];

        foreach ($pesanans as $pesanan) {
            $statusText = match ($pesanan->status_pesanan) {
                'diproses' => 'sedang diproses',
                'siap diambil' => 'siap diambil',
                default => $pesanan->status_pesanan,
            };

            // Format waktu pengambilan
            $waktuPengambilan = $pesanan->wkt_pengambilan
                ? $pesanan->wkt_pengambilan->format('d M Y - H:i')
                : '-';

            // Hitung total item
            $totalItem = $pesanan->detailPesanan->sum('jml_peritem');

            // Buat pesan berdasarkan status
            $pesan = match ($pesanan->status_pesanan) {
                'diproses' => "Pesanan {$pesanan->kode_pesanan} sedang {$statusText}",
                'siap diambil' => "Pesanan {$pesanan->kode_pesanan} {$statusText}!",
                default => "Pesanan {$pesanan->kode_pesanan}",
            };

            // Tentukan tipe notifikasi untuk styling
            $tipe = $pesanan->status_pesanan === 'siap diambil' ? 'success' : 'info';

            $notifikasi[] = [
                'id_pesanan' => $pesanan->id_pesanan,
                'kode_pesanan' => $pesanan->kode_pesanan,
                'status' => $pesanan->status_pesanan,
                'status_text' => $statusText,
                'tipe' => $tipe,
                'pesan' => $pesan,
                'wkt_pengambilan' => $waktuPengambilan,
                'total_item' => $totalItem,
                'total_harga' => (float) $pesanan->total_harga,
            ];
        }

        return response()->json([
            'notifikasi' => $notifikasi,
            'count' => count($notifikasi),
            'siap_diambil_count' => collect($notifikasi)->where('status', 'siap diambil')->count(),
        ]);
    }
}