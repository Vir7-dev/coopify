<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogTransaksi extends Model
{
    protected $table = 'log_transaksi';

    protected $primaryKey = 'id_transaksi';

    public $timestamps = false;

    protected $fillable = [
        'id_transaksi_ext',
        'id_pem_fk_lm',
        'status_transaksi',
        'jumlah_bayar',
        'kunci_tanda_tangan',
        'waktu_transaksi',
        'payload_midtrans'
    ];

    protected $casts = [
        'jumlah_bayar' => 'decimal:2',
        'waktu_transaksi' => 'datetime',
        'payload_midtrans' => 'array'
    ];

    public function pembayaran()
    {
        return $this->belongsTo(
            Pembayaran::class,
            'id_pem_fk_lm',
            'id_pembayaran'
        );
    }
}