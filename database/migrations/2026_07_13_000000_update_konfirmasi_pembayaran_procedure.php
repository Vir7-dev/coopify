<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS konfirmasi_pembayaran");
        
        DB::unprepared("
            CREATE PROCEDURE konfirmasi_pembayaran(
                IN p_id_pembayaran INT, 
                IN p_transaction_id VARCHAR(100), 
                IN p_status_transaksi VARCHAR(50), 
                IN p_jumlah_bayar DECIMAL(15,2), 
                IN p_kunci_tanda_tangan VARCHAR(255), 
                OUT p_pesan VARCHAR(255)
            )
            BEGIN
                DECLARE v_status_pem VARCHAR(50);
                DECLARE v_id_pesanan INT;

                DECLARE EXIT HANDLER FOR SQLEXCEPTION
                BEGIN
                    ROLLBACK;
                    SET p_pesan = 'Gagal: transaksi dibatalkan';
                END;

                START TRANSACTION;

                SELECT status_pem, id_pes_fk_pb
                INTO v_status_pem, v_id_pesanan
                FROM pembayaran WHERE id_pembayaran = p_id_pembayaran FOR UPDATE;

                IF v_status_pem IS NULL THEN
                    ROLLBACK;
                    SET p_pesan = 'Gagal: pembayaran tidak ditemukan';
                ELSEIF v_status_pem = 'lunas' THEN
                    ROLLBACK;
                    SET p_pesan = 'Pembayaran sudah pernah dikonfirmasi';
                ELSE
                    INSERT INTO log_transaksi(id_transaksi_ext, status_transaksi, jumlah_bayar, kunci_tanda_tangan, waktu_transaksi, id_pem_fk_lm)
                    VALUES(p_transaction_id, p_status_transaksi, p_jumlah_bayar, p_kunci_tanda_tangan, NOW(), p_id_pembayaran);

                    IF p_status_transaksi = 'lunas' THEN
                        UPDATE pembayaran SET status_pem = 'lunas', paid_at = NOW(), midtrans_transaction_id = p_transaction_id WHERE id_pembayaran = p_id_pembayaran;
                        UPDATE pesanan SET status_pesanan = 'menunggu' WHERE id_pesanan = v_id_pesanan;
                        SET p_pesan = 'Berhasil: pembayaran dikonfirmasi';

                    ELSEIF p_status_transaksi = 'menunggu' THEN
                        UPDATE pembayaran SET status_pem = 'menunggu' WHERE id_pembayaran = p_id_pembayaran;
                        SET p_pesan = 'Pembayaran masih menunggu';

                    ELSEIF p_status_transaksi = 'kadaluarsa' THEN
                        UPDATE pembayaran SET status_pem = 'kadaluarsa' WHERE id_pembayaran = p_id_pembayaran;
                        UPDATE pesanan SET status_pesanan = 'kadaluarsa' WHERE id_pesanan = v_id_pesanan;
                        UPDATE produk p INNER JOIN detail_pesanan dp ON dp.id_prod_fk_dp = p.id_produk SET p.stok = p.stok + dp.jml_peritem WHERE dp.id_pes_fk_dp = v_id_pesanan;
                        SET p_pesan = 'Pembayaran kadaluarsa';

                    ELSE
                        UPDATE pembayaran SET status_pem = 'gagal' WHERE id_pembayaran = p_id_pembayaran;
                        SET p_pesan = 'Pembayaran gagal';
                    END IF;
                    COMMIT;
                END IF;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS konfirmasi_pembayaran");
        
        DB::unprepared("
            CREATE PROCEDURE konfirmasi_pembayaran(
                IN p_id_pembayaran INT, 
                IN p_transaction_id VARCHAR(100), 
                IN p_status_transaksi VARCHAR(50), 
                IN p_jumlah_bayar DECIMAL(15,2), 
                IN p_kunci_tanda_tangan VARCHAR(255), 
                OUT p_pesan VARCHAR(255)
            )
            BEGIN
                DECLARE v_status_pem VARCHAR(50);
                DECLARE v_id_pesanan INT;

                DECLARE EXIT HANDLER FOR SQLEXCEPTION
                BEGIN
                    ROLLBACK;
                    SET p_pesan = 'Gagal: transaksi dibatalkan';
                END;

                START TRANSACTION;

                SELECT status_pem, id_pes_fk_pb
                INTO v_status_pem, v_id_pesanan
                FROM pembayaran WHERE id_pembayaran = p_id_pembayaran FOR UPDATE;

                IF v_status_pem IS NULL THEN
                    ROLLBACK;
                    SET p_pesan = 'Gagal: pembayaran tidak ditemukan';
                ELSEIF v_status_pem = 'lunas' THEN
                    ROLLBACK;
                    SET p_pesan = 'Pembayaran sudah pernah dikonfirmasi';
                ELSE
                    INSERT INTO log_transaksi(id_transaksi_ext, status_transaksi, jumlah_bayar, kunci_tanda_tangan, waktu_transaksi, id_pem_fk_lm)
                    VALUES(p_transaction_id, p_status_transaksi, p_jumlah_bayar, p_kunci_tanda_tangan, NOW(), p_id_pembayaran);

                    IF p_status_transaksi = 'lunas' THEN
                        UPDATE pembayaran SET status_pem = 'lunas', paid_at = NOW(), midtrans_transaction_id = p_transaction_id WHERE id_pembayaran = p_id_pembayaran;
                        UPDATE pesanan SET status_pesanan = 'diproses' WHERE id_pesanan = v_id_pesanan;
                        SET p_pesan = 'Berhasil: pembayaran dikonfirmasi';

                    ELSEIF p_status_transaksi = 'menunggu' THEN
                        UPDATE pembayaran SET status_pem = 'menunggu' WHERE id_pembayaran = p_id_pembayaran;
                        SET p_pesan = 'Pembayaran masih menunggu';

                    ELSEIF p_status_transaksi = 'kadaluarsa' THEN
                        UPDATE pembayaran SET status_pem = 'kadaluarsa' WHERE id_pembayaran = p_id_pembayaran;
                        UPDATE pesanan SET status_pesanan = 'kadaluarsa' WHERE id_pesanan = v_id_pesanan;
                        UPDATE produk p INNER JOIN detail_pesanan dp ON dp.id_prod_fk_dp = p.id_produk SET p.stok = p.stok + dp.jml_peritem WHERE dp.id_pes_fk_dp = v_id_pesanan;
                        SET p_pesan = 'Pembayaran kadaluarsa';

                    ELSE
                        UPDATE pembayaran SET status_pem = 'gagal' WHERE id_pembayaran = p_id_pembayaran;
                        SET p_pesan = 'Pembayaran gagal';
                    END IF;
                    COMMIT;
                END IF;
            END
        ");
    }
};
