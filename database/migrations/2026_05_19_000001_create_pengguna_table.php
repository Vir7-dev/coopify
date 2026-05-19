<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pengguna')) return;

        Schema::create('pengguna', function (Blueprint $table) {
            $table->integer('id_pengguna')->autoIncrement();
            $table->string('nim_nik', 50)->unique('uq_pengguna_nim_nik');
            $table->string('nama', 100);
            $table->string('email', 100)->unique('uq_pengguna_email');
            $table->string('no_hp', 20)->nullable();
            $table->string('password', 255);
            $table->string('foto_profil', 255)->nullable();
            $table->enum('role', ['admin', 'anggota'])->default('anggota');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengguna');
    }
};