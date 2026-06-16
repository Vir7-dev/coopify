<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens; // ← tambah ini
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // ← tambah HasApiTokens di sini

    protected $table      = 'pengguna';
    protected $primaryKey = 'id_pengguna';
    public    $timestamps = false;

    protected $fillable = [
        'nim_nik',
        'nama',
        'email',
        'no_hp',
        'foto_profil',
        'role',
        'password',
    ];

    protected $hidden = ['password'];

    public function pesanan()
    {
        return $this->hasMany(
            Pesanan::class,
            'id_peng_fk_ps',
            'id_pengguna'
        );
    }

    public function keranjang()
    {
        return $this->hasMany(
            Keranjang::class,
            'id_peng_fk_k',
            'id_pengguna'
        );
    }

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function getNameAttribute()
    {
        return $this->nama;
    }

    public function username()
    {
        return 'nim_nik';
    }
}
