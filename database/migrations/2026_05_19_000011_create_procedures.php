<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared("
            CREATE PROCEDURE IF NOT EXISTS `buat_pesanan` (
                IN `p_id_pengguna` INT,
                IN `p_id_produk` INT,
                IN `p_jumlah` INT,
                OUT `p_kode_pesanan` VARCHAR(50),
                OUT `p_pesan` VARCHAR(100)
            )
            BEGIN
                DECLARE v_stok INT;
                DECLARE v_harga_jual DECIMAL(15,2);
                DECLARE v_diskon DECIMAL(15,2) DEFAULT 0;
                DECLARE v_subtotal DECIMAL(15,2);
                DECLARE v_id_pesanan INT;
                DECLARE v_id_detail INT;
                DECLARE v_id_pembayaran INT;

                SELECT stok, harga_jual
                INTO v_stok, v_harga_jual
                FROM produk
                WHERE id_produk = p_id_produk;

                IF v_stok < p_jumlah THEN
                    SET p_pesan = 'Gagal: Stok tidak mencukupi';
                ELSE
                    SELECT COALESCE(harga_diskon, 0)
                    INTO v_diskon
                    FROM diskon
                    WHERE id_prod_fk_d = p_id_produk
                    LIMIT 1;

                    SET v_subtotal      = (v_harga_jual - v_diskon) * p_jumlah;
                    SET p_kode_pesanan  = CONCAT('ORD-', UNIX_TIMESTAMP());
                    SET v_id_pesanan    = (SELECT COALESCE(MAX(id_pesanan), 0) + 1 FROM pesanan);
                    SET v_id_detail     = (SELECT COALESCE(MAX(id_detail), 0) + 1 FROM detail_pesanan);
                    SET v_id_pembayaran = (SELECT COALESCE(MAX(id_pembayaran), 0) + 1 FROM pembayaran);

                    INSERT INTO pesanan (id_pesanan, kode_pesanan, tgl_pesanan, total_harga, status_pesanan, id_peng_fk_ps)
                    VALUES (v_id_pesanan, p_kode_pesanan, NOW(), v_subtotal, 'menunggu', p_id_pengguna);

                    INSERT INTO detail_pesanan (id_detail, jml_peritem, harga_saat_pesan, diskon_saat_pesan, subtotal_dp, id_pes_fk_dp, id_prod_fk_dp)
                    VALUES (v_id_detail, p_jumlah, v_harga_jual, v_diskon, v_subtotal, v_id_pesanan, p_id_produk);

                    INSERT INTO pembayaran (id_pembayaran, status_pem, batas_wkt_pem, id_pes_fk_pb)
                    VALUES (v_id_pembayaran, 'belum_bayar', DATE_ADD(NOW(), INTERVAL 15 MINUTE), v_id_pesanan);

                    UPDATE produk SET stok = stok - p_jumlah WHERE id_produk = p_id_produk;

                    SET p_pesan = 'Berhasil: Pesanan berhasil dibuat';
                END IF;
            END
        ");

        DB::unprepared("
            CREATE PROCEDURE IF NOT EXISTS `konfirmasi_pembayaran` (
                IN `p_id_pembayaran` INT,
                IN `p_transaction_id` VARCHAR(100),
                IN `p_status_transaksi` VARCHAR(50),
                IN `p_jumlah_bayar` DECIMAL(15,2),
                IN `p_kunci_tanda_tangan` VARCHAR(512),
                OUT `p_pesan` VARCHAR(100)
            )
            BEGIN
                DECLARE v_id_transaksi INT;
                DECLARE v_id_pesanan INT;
                DECLARE v_error TINYINT DEFAULT 0;

                DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET v_error = 1;

                START TRANSACTION;

                    SELECT id_pes_fk_pb INTO v_id_pesanan
                    FROM pembayaran
                    WHERE id_pembayaran = p_id_pembayaran;

                    SET v_id_transaksi = (SELECT COALESCE(MAX(id_transaksi), 0) + 1 FROM log_transaksi);

                    INSERT INTO log_transaksi (id_transaksi, id_transaksi_ext, status_transaksi, waktu_transaksi, jumlah_bayar, kunci_tanda_tangan, id_pem_fk_tm)
                    VALUES (v_id_transaksi, p_transaction_id, p_status_transaksi, NOW(), p_jumlah_bayar, p_kunci_tanda_tangan, p_id_pembayaran);

                    UPDATE pembayaran
                    SET status_pem = 'lunas'
                    WHERE id_pembayaran = p_id_pembayaran;

                    UPDATE pesanan
                    SET status_pesanan = 'diproses'
                    WHERE id_pesanan = v_id_pesanan;

                IF v_error = 1 THEN
                    ROLLBACK;
                    SET p_pesan = 'Gagal: Terjadi kesalahan, transaksi dibatalkan';
                ELSE
                    COMMIT;
                    SET p_pesan = 'Berhasil: Pembayaran dikonfirmasi';
                END IF;
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS `buat_pesanan`');
        DB::unprepared('DROP PROCEDURE IF EXISTS `konfirmasi_pembayaran`');
    }
};