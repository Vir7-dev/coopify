<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'pengguna';

    protected $primaryKey = 'id_pengguna';

    protected $fillable = [
        'nim_nik',
        'nama',
        'password',
        'foto_profl',
        'no_hp',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    public $timestamps = false;
}