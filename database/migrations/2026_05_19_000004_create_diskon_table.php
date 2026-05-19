<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('diskon')) return;

        Schema::create('diskon', function (Blueprint $table) {
            $table->integer('id_diskon')->autoIncrement();
            $table->decimal('persen_diskon', 5, 2);
            $table->decimal('harga_diskon', 15, 2);
            $table->integer('id_prod_fk_d');

            $table->foreign('id_prod_fk_d', 'fk_diskon_produk')
                  ->references('id_produk')->on('produk')
                  ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diskon');
    }
};