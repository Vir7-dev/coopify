<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('log_transaksi')) return;

        Schema::create('log_transaksi', function (Blueprint $table) {
            $table->integer('id_transaksi')->autoIncrement();
            $table->string('id_transaksi_ext', 100)->unique('uq_log_transaksi_ext');
            $table->string('status_transaksi', 50);
            $table->dateTime('waktu_transaksi');
            $table->decimal('jumlah_bayar', 15, 2);
            $table->string('kunci_tanda_tangan', 512)->nullable();
            $table->integer('id_pem_fk_tm');

            $table->foreign('id_pem_fk_tm', 'fk_log_transaksi_pembayaran')
                  ->references('id_pembayaran')->on('pembayaran')
                  ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_transaksi');
    }
};