<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPesanan extends Model
{
    protected $table = 'detail_pesanan';

    protected $primaryKey = 'id_detail';

    public $timestamps = false;

    protected $fillable = [
        'jml_peritem',
        'harga_saat_pesan',
        'diskon_saat_pesan',
        'subtotal_dp',
        'id_pes_fk_dp',
        'id_prod_fk_dp'
    ];

    protected $casts = [
        'harga_saat_pesan' => 'decimal:2',
        'diskon_saat_pesan' => 'decimal:2',
        'subtotal_dp' => 'decimal:2'
    ];

    public function pesanan()
    {
        return $this->belongsTo(
            Pesanan::class,
            'id_pes_fk_dp',
            'id_pesanan'
        );
    }

    public function produk()
    {
        return $this->belongsTo(
            Produk::class,
            'id_prod_fk_dp',
            'id_produk'
        );
    }
}