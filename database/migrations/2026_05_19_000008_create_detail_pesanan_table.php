<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('detail_pesanan')) return;

        Schema::create('detail_pesanan', function (Blueprint $table) {
            $table->integer('id_detail')->autoIncrement();
            $table->integer('jml_peritem')->default(1);
            $table->decimal('harga_saat_pesan', 15, 2);
            $table->decimal('diskon_saat_pesan', 15, 2)->default(0.00);
            $table->decimal('subtotal_dp', 15, 2)->default(0.00);
            $table->integer('id_pes_fk_dp');
            $table->integer('id_prod_fk_dp');

            $table->foreign('id_pes_fk_dp', 'fk_detail_pesanan_pesanan')
                  ->references('id_pesanan')->on('pesanan')
                  ->onUpdate('cascade')->onDelete('cascade');

            $table->foreign('id_prod_fk_dp', 'fk_detail_pesanan_produk')
                  ->references('id_produk')->on('produk')
                  ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_pesanan');
    }
};