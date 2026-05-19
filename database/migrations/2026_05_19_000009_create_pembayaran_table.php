<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pembayaran')) return;

        Schema::create('pembayaran', function (Blueprint $table) {
            $table->integer('id_pembayaran')->autoIncrement();
            $table->enum('status_pem', ['belum_bayar', 'lunas', 'kadaluarsa', 'gagal'])
                  ->default('belum_bayar');
            $table->dateTime('batas_wkt_pem')->nullable();
            $table->integer('id_pes_fk_pb');

            $table->foreign('id_pes_fk_pb', 'fk_pembayaran_pesanan')
                  ->references('id_pesanan')->on('pesanan')
                  ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};