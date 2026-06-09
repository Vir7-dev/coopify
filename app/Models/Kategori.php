<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Produk;

class Kategori extends Model
{
    protected $table = 'kategori_produk';
    protected $primaryKey = 'id_kategori';
    public $timestamps = true;
    const CREATED_AT = 'tgl_dibuat';
    const UPDATED_AT = null;  // tidak ada updated_at

    protected $fillable = [
        'nama_kategori',
        'ikon',
    ];

    protected $dates = ['tgl_dibuat'];

    public function produk()
    {
        return $this->hasMany(Produk::class, 'id_kat_fk_p', 'id_kategori');
    }
}