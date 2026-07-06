<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Kategori;
use App\Models\Diskon;

class Produk extends Model
{
    protected $table = 'produk';
    protected $primaryKey = 'id_produk';
    public $timestamps = false;
    protected $fillable =  [
        'nama_produk',
        'harga_jual',
        'stok',
        'id_disk_fk_p',
        'id_kat_fk_p',
        'deskripsi'
    ];
    
    protected $appends = [
        'harga_setelah_diskon'
    ];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'id_kat_fk_p');
    }

    public function gambar()
    {
        return $this->hasMany(Gambar::class, 'id_prod_fk_g');
    }

    public function detailPesanan()
    {
        return $this->hasMany(
            DetailPesanan::class,
            'id_prod_fk_dp',
            'id_produk'
        );
    }

    public function keranjang()
    {
        return $this->hasMany(
            Keranjang::class,
            'id_prod_fk_k',
            'id_produk'
        );
    }

    public function diskon()
    {
        return $this->belongsTo(Diskon::class, 'id_disk_fk_p');
    }

    public function getHargaSetelahDiskonAttribute()
    {
        $harga = (float) $this->harga_jual;

        // Prioritaskan harga_diskon jika ada (harga tetap setelah diskon)
        if ($this->diskon && (float) $this->diskon->harga_diskon > 0) {
            return (float) $this->diskon->harga_diskon;
        }

        // Hitung dari persen_diskon jika ada
        if ($this->diskon && (int) $this->diskon->persen_diskon > 0) {
            $diskon = (int) $this->diskon->persen_diskon;
            $potongan = ($harga * $diskon) / 100;
            return (int) ($harga - $potongan);
        }

        return $harga;
    }
}
