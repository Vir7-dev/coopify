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
        'id_peng_fk_ps',
    ];

    // Relasi ke pengguna
    public function pengguna()
    {
        return $this->belongsTo(User::class, 'id_peng_fk_ps', 'id_pengguna');
    }
}