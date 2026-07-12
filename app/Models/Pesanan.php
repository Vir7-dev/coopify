<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    protected $table      = 'pesanan';
    protected $primaryKey = 'id_pesanan';
    public    $timestamps = false;

    protected $fillable = [
        'kode_pesanan',
        'tgl_pesanan',
        'wkt_pengambilan',
        'status_pesanan',
        'total_harga',
        'id_peng_fk_ps'
    ];

    protected $casts = [
        'tgl_pesanan' => 'datetime',
        'wkt_pengambilan' => 'datetime',
        'total_harga' => 'decimal:2'
    ];

    public function pembayaran()
    {
        return $this->hasOne(
            Pembayaran::class,
            'id_pes_fk_pb',
            'id_pesanan'
        );
    }

    public function detailPesanan()
    {
        return $this->hasMany(
            DetailPesanan::class,
            'id_pes_fk_dp',
            'id_pesanan'
        );
    }

    public function pengguna()
    {
        return $this->belongsTo(
            User::class,
            'id_peng_fk_ps',
            'id_pengguna'
        );
    }

    public function getStatusPesananAttribute($value)
    {
        if ($value === 'menunggu') {
            $pembayaran = $this->pembayaran;
            if ($pembayaran && $pembayaran->status_pem === 'belum_bayar') {
                return 'belum bayar';
            }
        }
        return $value;
    }
}