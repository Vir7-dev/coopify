<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('keranjang')) return;

        Schema::create('keranjang', function (Blueprint $table) {
            $table->integer('id_keranjang')->autoIncrement();
            $table->integer('jml_dikeranjang')->default(1);
            $table->integer('id_peng_fk_k');
            $table->integer('id_prod_fk_k');

            $table->foreign('id_peng_fk_k', 'fk_keranjang_pengguna')
                  ->references('id_pengguna')->on('pengguna')
                  ->onUpdate('cascade')->onDelete('cascade');

            $table->foreign('id_prod_fk_k', 'fk_keranjang_produk')
                  ->references('id_produk')->on('produk')
                  ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('keranjang');
    }
};