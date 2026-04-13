<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // 🔥 pakai tabel pengguna
    protected $table = 'pengguna';

    // 🔥 kalau tetap pakai id_pengguna
    protected $primaryKey = 'id_pengguna';

    // 🔥 kolom yang bisa diisi
    protected $fillable = [
        'nim_nik',
        'nama',
        'password',
        'foto_profl',
        'no_hp',
        'role',
    ];

    // 🔥 kolom yang disembunyikan
    protected $hidden = [
        'password',
    ];

    // 🔥 kalau gak pakai timestamps
    public $timestamps = false;

    // 🔥 biar Laravel tetap bisa akses "name"
    public function getNameAttribute()
    {
        return $this->nama;
    }

    // 🔥 pakai nim_nik untuk login
    public function username()
    {
        return 'nim_nik';
    }

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}