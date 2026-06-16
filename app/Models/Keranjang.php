<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model
{
    protected $table = 'keranjang';

    protected $primaryKey = 'id_keranjang';

    public $timestamps = false;

    protected $fillable = [
        'jml_dikeranjang',
        'id_prod_fk_k',
        'id_peng_fk_k'
    ];

    public function produk()
    {
        return $this->belongsTo(
            Produk::class,
            'id_prod_fk_k',
            'id_produk'
        );
    }

    public function pengguna()
    {
        return $this->belongsTo(
            User::class,
            'id_peng_fk_k',
            'id_pengguna'
        );
    }
}