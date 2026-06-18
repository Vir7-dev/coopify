<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $table = 'pembayaran';

    protected $primaryKey = 'id_pembayaran';

    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'status_pem',
        'total_bayar',
        'batas_wkt_pem',
        'id_pes_fk_pb',
        'snap_token',
        'midtrans_transaction_id',
        'paid_at'
    ];

    protected $casts = [
        'total_bayar' => 'decimal:2',
        'batas_wkt_pem' => 'datetime',
        'paid_at' => 'datetime'
    ];

    public function pesanan()
    {
        return $this->belongsTo(
            Pesanan::class,
            'id_pes_fk_pb',
            'id_pesanan'
        );
    }

    public function logTransaksi()
    {
        return $this->hasMany(
            LogTransaksi::class,
            'id_pem_fk_lm',
            'id_pembayaran'
        );
    }
}