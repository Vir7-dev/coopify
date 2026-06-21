<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diskon extends Model
{
    protected $table = 'diskon';
    protected $primaryKey = 'id_diskon';
    public $timestamps = false;

    protected $fillable = [
        'harga_diskon',
        'persen_diskon',
        'id_prod_fk_d'
    ];

    public function produk()
    {
        return $this->hasMany(Produk::class, 'id_disk_fk_p');
    }
}
