<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable; 

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