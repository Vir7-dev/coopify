<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('kategori_produk')) return;

        Schema::create('kategori_produk', function (Blueprint $table) {
            $table->integer('id_kategori')->autoIncrement();
            $table->string('nama_kategori', 100)->unique('fk_nama_kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kategori_produk');
    }
};