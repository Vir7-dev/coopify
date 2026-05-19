<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('produk')) return;

        Schema::create('produk', function (Blueprint $table) {
            $table->integer('id_produk')->autoIncrement();
            $table->string('nama_produk', 150);
            $table->decimal('harga_jual', 15, 2);
            $table->integer('stok')->default(0);
            $table->date('tgl_kadaluarsa')->nullable();
            $table->integer('id_kat_fk_p');

            $table->foreign('id_kat_fk_p', 'fk_produk_kategori')
                  ->references('id_kategori')->on('kategori_produk')
                  ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};