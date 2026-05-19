<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pesanan')) return;

        Schema::create('pesanan', function (Blueprint $table) {
            $table->integer('id_pesanan')->autoIncrement();
            $table->string('kode_pesanan', 50)->unique('uq_pesanan_kode');
            $table->dateTime('tgl_pesanan');
            $table->dateTime('wkt_pengambilan')->nullable();
            $table->decimal('total_harga', 15, 2)->default(0.00);
            $table->enum('status_pesanan', ['menunggu', 'diproses', 'siap_diambil', 'selesai', 'dibatalkan'])
                  ->default('menunggu');
            $table->integer('id_peng_fk_ps');

            $table->foreign('id_peng_fk_ps', 'fk_pesanan_pengguna')
                  ->references('id_pengguna')->on('pengguna')
                  ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};