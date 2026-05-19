<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('gambar')) return;

        Schema::create('gambar', function (Blueprint $table) {
            $table->integer('id_gambar')->autoIncrement();
            $table->string('url_gambar', 255);
            $table->integer('id_prod_fk_g');

            $table->foreign('id_prod_fk_g', 'fk_gambar_produk')
                  ->references('id_produk')->on('produk')
                  ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gambar');
    }
};