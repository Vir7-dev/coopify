<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Kategori;

class Produk extends Model
{
    protected $table = 'produk';
    protected $primaryKey = 'id_produk';
    public $timestamps = false;
    protected $fillable =  [
        'nama_produk',
        'harga_jual',
        'stok',
        'tgl_kadaluarsa',
        'id_kat_fk_p',
        'deskripsi'
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
}
