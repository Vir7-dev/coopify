<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gambar extends Model
{
    protected $table = 'gambar';
    protected $primaryKey = 'id_gambar';
    public $timestamps = false;

    protected $fillable = [
        'url_gambar',
        'id_prod_fk_g'
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'id_prod_fk_g');
    }
}
