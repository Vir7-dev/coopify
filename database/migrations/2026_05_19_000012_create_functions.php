<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared("
            CREATE FUNCTION IF NOT EXISTS `cek_stok_tersedia` (
                `p_id_produk` INT,
                `p_jumlah` INT
            )
            RETURNS TINYINT(1)
            DETERMINISTIC
            READS SQL DATA
            BEGIN
                DECLARE v_stok INT;

                SELECT stok INTO v_stok
                FROM produk
                WHERE id_produk = p_id_produk;

                RETURN v_stok >= p_jumlah;
            END
        ");

        DB::unprepared("
            CREATE FUNCTION IF NOT EXISTS `hitung_total_belanja` (
                `p_id_pengguna` INT
            )
            RETURNS DECIMAL(15,2)
            DETERMINISTIC
            READS SQL DATA
            BEGIN
                DECLARE v_total DECIMAL(15,2) DEFAULT 0;

                SELECT COALESCE(SUM(p.total_harga), 0)
                INTO v_total
                FROM pesanan p
                JOIN pembayaran pb ON pb.id_pes_fk_pb = p.id_pesanan
                WHERE p.id_peng_fk_ps = p_id_pengguna
                  AND pb.status_pem   = 'lunas';

                RETURN v_total;
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP FUNCTION IF EXISTS `cek_stok_tersedia`');
        DB::unprepared('DROP FUNCTION IF EXISTS `hitung_total_belanja`');
    }
};