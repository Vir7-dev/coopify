-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 16, 2026 at 07:35 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `coopify`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `batalkan_pesanan` (IN `p_id_pesanan` INT)   BEGIN

    DECLARE v_status_pesanan VARCHAR(50);

    DECLARE v_status_pembayaran VARCHAR(50);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN

        ROLLBACK;

    END;

    START TRANSACTION;

    SELECT
        status_pesanan
    INTO
        v_status_pesanan
    FROM pesanan
    WHERE id_pesanan = p_id_pesanan
    FOR UPDATE;

    IF v_status_pesanan IS NULL THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT='Pesanan tidak ditemukan';

    END IF;

    IF v_status_pesanan = 'dibatalkan' THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT='Pesanan sudah dibatalkan';

    END IF;

    IF v_status_pesanan = 'selesai' THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT='Pesanan sudah selesai';

    END IF;

    SELECT
        status_pem
    INTO
        v_status_pembayaran
    FROM pembayaran
    WHERE id_pes_fk_pb = p_id_pesanan
    LIMIT 1;

    IF v_status_pembayaran = 'lunas' THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT='Pesanan sudah dibayar';

    END IF;

    UPDATE produk p

    JOIN detail_pesanan dp
    ON dp.id_prod_fk_dp = p.id_produk

    SET
        p.stok = p.stok + dp.jml_peritem

    WHERE dp.id_pes_fk_dp = p_id_pesanan;

    UPDATE pesanan

    SET status_pesanan='dibatalkan'

    WHERE id_pesanan=p_id_pesanan;

    UPDATE pembayaran

    SET status_pem='gagal'

    WHERE id_pes_fk_pb=p_id_pesanan;

    COMMIT;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `checkout_keranjang` (IN `p_id_pengguna` INT, OUT `p_kode_pesanan` VARCHAR(50), OUT `p_pesan` VARCHAR(255))   BEGIN

    DECLARE v_total_harga DECIMAL(15,2) DEFAULT 0;
    DECLARE v_id_pesanan INT;
    DECLARE v_jumlah_item INT DEFAULT 0;
    DECLARE v_stok_tidak_cukup INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_pesan='Gagal: transaksi dibatalkan';
    END;

    START TRANSACTION;

    /* ==========================
       CEK KERANJANG KOSONG
       ========================== */

    SELECT COUNT(*)
    INTO v_jumlah_item
    FROM keranjang
    WHERE id_peng_fk_k = p_id_pengguna;

    IF v_jumlah_item = 0 THEN

        ROLLBACK;
        SET p_pesan='Gagal: keranjang kosong';

    ELSE

        /* ==========================
           LOCK PRODUK YANG DIBELI
           ========================== */

        SELECT p.id_produk
        FROM produk p
        JOIN keranjang k
            ON k.id_prod_fk_k = p.id_produk
        WHERE k.id_peng_fk_k = p_id_pengguna
        FOR UPDATE;

        /* ==========================
           VALIDASI STOK
           ========================== */

        SELECT COUNT(*)
        INTO v_stok_tidak_cukup

        FROM keranjang k

        JOIN produk p
            ON p.id_produk = k.id_prod_fk_k

        WHERE

            k.id_peng_fk_k = p_id_pengguna

            AND

            k.jml_dikeranjang > p.stok;

        IF v_stok_tidak_cukup > 0 THEN

            ROLLBACK;

            SET p_pesan =
            'Gagal: terdapat produk dengan stok tidak mencukupi';

        ELSE

            /* ==========================
               HITUNG TOTAL
               ========================== */

            SELECT

                SUM(
                    (
                        p.harga_jual
                        -
                        COALESCE(d.harga_diskon,0)
                    )
                    *
                    k.jml_dikeranjang
                )

            INTO v_total_harga

            FROM keranjang k

            JOIN produk p
                ON p.id_produk = k.id_prod_fk_k

            LEFT JOIN diskon d
                ON d.id_prod_fk_d = p.id_produk

            WHERE k.id_peng_fk_k = p_id_pengguna;

            /* ==========================
               KODE PESANAN
               ========================== */

            SET p_kode_pesanan =
            CONCAT(
                'ORD-',
                UNIX_TIMESTAMP(),
                '-',
                FLOOR(RAND()*9999)
            );

            /* ==========================
               INSERT PESANAN
               ========================== */

            INSERT INTO pesanan(

                kode_pesanan,
                tgl_pesanan,
                total_harga,
                status_pesanan,
                id_peng_fk_ps

            )

            VALUES(

                p_kode_pesanan,
                NOW(),
                v_total_harga,
                'menunggu',
                p_id_pengguna

            );

            SET v_id_pesanan = LAST_INSERT_ID();

            /* ==========================
               DETAIL PESANAN
               ========================== */

            INSERT INTO detail_pesanan(

                jml_peritem,
                harga_saat_pesan,
                diskon_saat_pesan,
                subtotal_dp,
                id_pes_fk_dp,
                id_prod_fk_dp

            )

            SELECT

                k.jml_dikeranjang,

                p.harga_jual,

                COALESCE(d.harga_diskon,0),

                (
                    (
                        p.harga_jual
                        -
                        COALESCE(d.harga_diskon,0)
                    )
                    *
                    k.jml_dikeranjang
                ),

                v_id_pesanan,

                p.id_produk

            FROM keranjang k

            JOIN produk p
                ON p.id_produk = k.id_prod_fk_k

            LEFT JOIN diskon d
                ON d.id_prod_fk_d = p.id_produk

            WHERE k.id_peng_fk_k = p_id_pengguna;

            /* ==========================
               KURANGI STOK
               ========================== */

            UPDATE produk p

            JOIN keranjang k
                ON k.id_prod_fk_k = p.id_produk

            SET

                p.stok =
                p.stok - k.jml_dikeranjang

            WHERE k.id_peng_fk_k = p_id_pengguna;

            /* ==========================
               PEMBAYARAN QRIS
               ========================== */

            INSERT INTO pembayaran(

                status_pem,
                total_bayar,
                batas_wkt_pem,
                id_pes_fk_pb

            )

            VALUES(

                'menunggu',
                v_total_harga,
                DATE_ADD(NOW(),INTERVAL 24 HOUR),
                v_id_pesanan

            );

            /* ==========================
               KOSONGKAN KERANJANG
               ========================== */

            DELETE FROM keranjang
            WHERE id_peng_fk_k = p_id_pengguna;

            COMMIT;

            SET p_pesan='Berhasil: checkout berhasil';

        END IF;

    END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `konfirmasi_pembayaran` (IN `p_id_pembayaran` INT, IN `p_transaction_id` VARCHAR(100), IN `p_status_transaksi` VARCHAR(50), IN `p_jumlah_bayar` DECIMAL(15,2), IN `p_kunci_tanda_tangan` VARCHAR(255), OUT `p_pesan` VARCHAR(255))   BEGIN

    DECLARE v_status_pem VARCHAR(50);
    DECLARE v_id_pesanan INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_pesan = 'Gagal: transaksi dibatalkan';
    END;

    START TRANSACTION;

    SELECT
        status_pem,
        id_pes_fk_pb
    INTO
        v_status_pem,
        v_id_pesanan
    FROM pembayaran
    WHERE id_pembayaran = p_id_pembayaran
    FOR UPDATE;

    IF v_status_pem IS NULL THEN

        ROLLBACK;
        SET p_pesan = 'Gagal: pembayaran tidak ditemukan';

    ELSEIF v_status_pem = 'lunas' THEN

        ROLLBACK;
        SET p_pesan = 'Pembayaran sudah pernah dikonfirmasi';

    ELSE

        INSERT INTO log_transaksi(
            id_transaksi_ext,
            status_transaksi,
            jumlah_bayar,
            kunci_tanda_tangan,
            waktu_transaksi,
            id_pem_fk_lm
        )
        VALUES(
            p_transaction_id,
            p_status_transaksi,
            p_jumlah_bayar,
            p_kunci_tanda_tangan,
            NOW(),
            p_id_pembayaran
        );

        IF p_status_transaksi = 'berhasil' THEN

            UPDATE pembayaran
            SET
                status_pem = 'lunas',
                paid_at = NOW(),
                midtrans_transaction_id = p_transaction_id
            WHERE id_pembayaran = p_id_pembayaran;

            UPDATE pesanan
            SET status_pesanan = 'diproses'
            WHERE id_pesanan = v_id_pesanan;

            SET p_pesan = 'Berhasil: pembayaran dikonfirmasi';

        ELSEIF p_status_transaksi = 'menunggu' THEN

            UPDATE pembayaran
            SET status_pem = 'menunggu'
            WHERE id_pembayaran = p_id_pembayaran;

            SET p_pesan = 'Pembayaran masih menunggu';

        ELSE

            UPDATE pembayaran
            SET status_pem = 'gagal'
            WHERE id_pembayaran = p_id_pembayaran;

            SET p_pesan = 'Pembayaran gagal';

        END IF;

        COMMIT;

    END IF;

END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `cek_stok_tersedia` (`p_id_produk` INT, `p_jumlah` INT) RETURNS TINYINT(1) DETERMINISTIC READS SQL DATA BEGIN
    DECLARE v_stok INT;

    SELECT stok INTO v_stok
    FROM produk
    WHERE id_produk = p_id_produk;

    RETURN v_stok >= p_jumlah;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `hitung_total_belanja` (`p_id_pengguna` INT) RETURNS DECIMAL(15,2) DETERMINISTIC READS SQL DATA BEGIN
    DECLARE v_total DECIMAL(15,2) DEFAULT 0;

    SELECT COALESCE(SUM(p.total_harga), 0)
    INTO v_total
    FROM pesanan p
    JOIN pembayaran pb ON pb.id_pes_fk_pb = p.id_pesanan
    WHERE p.id_peng_fk_ps = p_id_pengguna
    AND pb.status_pem = 'lunas';

    RETURN v_total;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `detail_pesanan`
--

CREATE TABLE `detail_pesanan` (
  `id_detail` int NOT NULL,
  `jml_peritem` int NOT NULL DEFAULT '1',
  `harga_saat_pesan` decimal(15,2) NOT NULL,
  `diskon_saat_pesan` decimal(15,2) NOT NULL DEFAULT '0.00',
  `subtotal_dp` decimal(15,2) NOT NULL DEFAULT '0.00',
  `id_pes_fk_dp` int NOT NULL,
  `id_prod_fk_dp` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `diskon`
--

CREATE TABLE `diskon` (
  `id_diskon` int NOT NULL,
  `harga_diskon` decimal(15,2) NOT NULL DEFAULT '0.00',
  `persen_diskon` decimal(5,2) NOT NULL DEFAULT '0.00',
  `id_prod_fk_d` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `diskon`
--

INSERT INTO `diskon` (`id_diskon`, `harga_diskon`, `persen_diskon`, `id_prod_fk_d`) VALUES
(1, 2000.00, 13.33, 1),
(2, 3000.00, 16.67, 2),
(3, 1000.00, 12.50, 7),
(4, 3000.00, 15.00, 11),
(5, 2000.00, 13.33, 12);

-- --------------------------------------------------------

--
-- Table structure for table `gambar`
--

CREATE TABLE `gambar` (
  `id_gambar` int NOT NULL,
  `url_gambar` varchar(255) NOT NULL,
  `id_prod_fk_g` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `gambar`
--

INSERT INTO `gambar` (`id_gambar`, `url_gambar`, `id_prod_fk_g`) VALUES
(1, 'img/produk/geprek_1.jpg', 1),
(2, 'img/produk/nasgor_1.jpg', 2),
(3, 'img/produk/mieayam_1.jpg', 3),
(4, 'img/produk/esteh_1.jpg', 4),
(5, 'img/produk/esjeruk_1.jpg', 5),
(6, 'img/produk/jusalpukat_1.jpg', 6),
(7, 'img/produk/keripik_1.jpg', 7),
(8, 'img/produk/risol_1.jpg', 8),
(9, 'img/produk/donat_1.jpg', 9),
(10, 'img/produk/eskrim_1.jpg', 10),
(11, 'img/produk/paket1.jpg', 11),
(12, 'img/produk/paket2.jpg', 12),
(14, 'produk/4A56GGFh65nCnrqZDm8B8DIeaY67vIEPWi4PWfQO.png', 15);

-- --------------------------------------------------------

--
-- Table structure for table `kategori_produk`
--

CREATE TABLE `kategori_produk` (
  `id_kategori` int NOT NULL,
  `nama_kategori` varchar(100) NOT NULL,
  `ikon` varchar(255) DEFAULT NULL,
  `tgl_dibuat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kategori_produk`
--

INSERT INTO `kategori_produk` (`id_kategori`, `nama_kategori`, `ikon`, `tgl_dibuat`) VALUES
(1, 'Makanan', 'FaHamburger', '2024-01-01 08:00:00'),
(2, 'Minuman', 'FaMugHot', '2024-01-01 08:00:00'),
(3, 'Obat & Kesehatan', 'FaPills', '2024-01-01 08:00:00'),
(4, 'Alat tulis', 'FaPen', '2024-01-01 08:00:00'),
(5, 'Almamater', 'FaTshirt', '2024-01-01 08:00:00'),
(14, 'Buah', 'FaAppleAlt', '2026-05-31 19:03:12');

-- --------------------------------------------------------

--
-- Table structure for table `keranjang`
--

CREATE TABLE `keranjang` (
  `id_keranjang` int NOT NULL,
  `jml_dikeranjang` int NOT NULL DEFAULT '1',
  `id_prod_fk_k` int NOT NULL,
  `id_peng_fk_k` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `keranjang`
--

INSERT INTO `keranjang` (`id_keranjang`, `jml_dikeranjang`, `id_prod_fk_k`, `id_peng_fk_k`) VALUES
(9, 2, 1, 19);

-- --------------------------------------------------------

--
-- Table structure for table `laporan`
--

CREATE TABLE `laporan` (
  `id` int NOT NULL,
  `judul` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_transaksi`
--

CREATE TABLE `log_transaksi` (
  `id_transaksi` int NOT NULL,
  `id_transaksi_ext` varchar(100) DEFAULT NULL,
  `id_pem_fk_lm` int NOT NULL,
  `status_transaksi` enum('berhasil','gagal','menunggu') DEFAULT NULL,
  `jumlah_bayar` decimal(15,2) NOT NULL DEFAULT '0.00',
  `kunci_tanda_tangan` varchar(255) DEFAULT NULL,
  `waktu_transaksi` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payload_midtrans` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id_pembayaran` int NOT NULL,
  `status_pem` enum('menunggu','lunas','gagal','dikembalikan','kadaluarsa') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'menunggu',
  `total_bayar` decimal(12,2) DEFAULT NULL,
  `batas_wkt_pem` datetime DEFAULT NULL,
  `id_pes_fk_pb` int NOT NULL,
  `snap_token` varchar(255) DEFAULT NULL,
  `midtrans_transaction_id` varchar(100) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `pembayaran`
--
DELIMITER $$
CREATE TRIGGER `trg_cek_kadaluarsa_pembayaran` BEFORE UPDATE ON `pembayaran` FOR EACH ROW BEGIN
    IF NEW.status_pem = 'belum_bayar' AND NOW() > NEW.batas_wkt_pem THEN
        SET NEW.status_pem = 'kadaluarsa';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `id_pengguna` int NOT NULL,
  `nim_nik` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `foto_profil` varchar(255) DEFAULT NULL,
  `role` enum('admin','pengguna') NOT NULL DEFAULT 'pengguna',
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengguna`
--

INSERT INTO `pengguna` (`id_pengguna`, `nim_nik`, `nama`, `email`, `no_hp`, `foto_profil`, `role`, `password`, `created_at`, `updated_at`) VALUES
(19, 'ADM001', 'Admin Sistem', 'admin@toko.com', '081200000001', 'foto/admin.jpg', 'admin', '$2y$10$abcdefghijklmnopqrstuuVwXyZ0123456789ABCDEFGHIJKLMNOPQRs', '2026-06-05 03:26:04', '2026-06-05 03:26:04'),
(20, '2021001', 'Andi Pratama', 'andi@email.com', '081234567890', 'foto/andi.jpg', 'pengguna', '$2y$10$abcdefghijklmnopqrstuuVwXyZ0123456789ABCDEFGHIJKLMNOPQRs', '2026-06-05 03:26:04', '2026-06-05 03:26:04'),
(21, '2021002', 'Budi Santoso', 'budi@email.com', '081234567891', 'foto/budi.jpg', 'pengguna', '$2y$10$abcdefghijklmnopqrstuuVwXyZ0123456789ABCDEFGHIJKLMNOPQRs', '2026-06-05 03:26:04', '2026-06-05 03:26:04'),
(22, '2021003', 'Citra Dewi', 'citra@email.com', '081234567892', NULL, 'pengguna', '$2y$10$abcdefghijklmnopqrstuuVwXyZ0123456789ABCDEFGHIJKLMNOPQRs', '2026-06-05 03:26:04', '2026-06-05 03:26:04'),
(23, '2021004', 'Dina Rahma', 'dina@email.com', '081234567893', 'foto/dina.jpg', 'pengguna', '$2y$10$abcdefghijklmnopqrstuuVwXyZ0123456789ABCDEFGHIJKLMNOPQRs', '2026-06-05 03:26:04', '2026-06-05 03:26:04'),
(24, '2021005', 'Eko Wijaya', 'eko@email.com', '081234567894', NULL, 'pengguna', '$2y$10$abcdefghijklmnopqrstuuVwXyZ0123456789ABCDEFGHIJKLMNOPQRs', '2026-06-05 03:26:04', '2026-06-05 03:26:04');

-- --------------------------------------------------------

--
-- Table structure for table `pesanan`
--

CREATE TABLE `pesanan` (
  `id_pesanan` int NOT NULL,
  `kode_pesanan` varchar(50) NOT NULL,
  `tgl_pesanan` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `wkt_pengambilan` datetime DEFAULT NULL,
  `status_pesanan` enum('menunggu','diproses','siap diambil','selesai','dibatalkan') NOT NULL DEFAULT 'menunggu',
  `total_harga` decimal(15,2) NOT NULL DEFAULT '0.00',
  `id_peng_fk_ps` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id_produk` int NOT NULL,
  `nama_produk` varchar(150) NOT NULL,
  `stok` int NOT NULL DEFAULT '0',
  `harga_jual` decimal(15,2) NOT NULL,
  `tgl_kadaluarsa` date DEFAULT NULL,
  `id_kat_fk_p` int NOT NULL,
  `deskripsi` text,
  `status_produk` enum('aktif','habis','arsip') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id_produk`, `nama_produk`, `stok`, `harga_jual`, `tgl_kadaluarsa`, `id_kat_fk_p`, `deskripsi`, `status_produk`, `created_at`, `updated_at`) VALUES
(1, 'Nasi Ayam Geprek', 50, 15000.00, '2025-12-31', 1, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(2, 'Nasi Goreng Spesial', 40, 18000.00, '2025-12-31', 1, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(3, 'Mie Ayam Bakso', 35, 13000.00, '2025-12-31', 1, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(4, 'Es Teh Manis', 100, 5000.00, '2025-06-30', 2, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(5, 'Es Jeruk Peras', 80, 7000.00, '2025-06-30', 2, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(6, 'Jus Alpukat', 60, 12000.00, '2025-06-30', 2, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(7, 'Keripik Singkong', 75, 8000.00, '2025-09-30', 3, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(8, 'Risol Mayo', 90, 5000.00, '2025-07-31', 3, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(9, 'Donat Gula', 45, 6000.00, '2025-07-15', 4, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(10, 'Es Krim Cone', 55, 8000.00, '2025-08-31', 4, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(11, 'Paket Nasi + Minum', 30, 20000.00, '2025-12-31', 5, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(12, 'Paket Snack + Minum', 25, 15000.00, '2025-09-30', 5, NULL, 'aktif', '2026-06-05 03:26:37', '2026-06-05 03:26:37'),
(13, 'Mie Instann', 10, 5000.00, '2026-05-28', 1, 'null', 'aktif', '2026-06-05 03:26:37', '2026-06-12 02:39:46'),
(14, 'Ikan', 50, 20000.00, '2026-06-27', 1, 'Ikan enak', 'aktif', '2026-06-12 01:58:17', '2026-06-12 01:58:17'),
(15, 'Ayam', 30, 20000.00, '2026-06-13', 1, 'Ayam enak', 'aktif', '2026-06-12 02:04:33', '2026-06-12 02:04:33');

--
-- Triggers `produk`
--
DELIMITER $$
CREATE TRIGGER `trg_status_produk` BEFORE UPDATE ON `produk` FOR EACH ROW BEGIN

    IF NEW.stok <= 0 THEN

        SET NEW.status_produk='habis';

    ELSE

        SET NEW.status_produk='aktif';

    END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_produk_diskon`
-- (See below for the actual view)
--
CREATE TABLE `vw_produk_diskon` (
`id_produk` int
,`nama_produk` varchar(150)
,`harga_jual` decimal(15,2)
,`persen_diskon` decimal(5,2)
,`harga_setelah_diskon` decimal(16,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_produk_hampir_expired`
-- (See below for the actual view)
--
CREATE TABLE `vw_produk_hampir_expired` (
`id_produk` int
,`nama_produk` varchar(150)
,`stok` int
,`tgl_kadaluarsa` date
,`sisa_hari` int
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `fk_detail_pesanan` (`id_pes_fk_dp`),
  ADD KEY `fk_detail_produk` (`id_prod_fk_dp`);

--
-- Indexes for table `diskon`
--
ALTER TABLE `diskon`
  ADD PRIMARY KEY (`id_diskon`),
  ADD UNIQUE KEY `uq_diskon_produk` (`id_prod_fk_d`),
  ADD KEY `fk_diskon_produk` (`id_prod_fk_d`);

--
-- Indexes for table `gambar`
--
ALTER TABLE `gambar`
  ADD PRIMARY KEY (`id_gambar`),
  ADD KEY `fk_gambar_produk` (`id_prod_fk_g`);

--
-- Indexes for table `kategori_produk`
--
ALTER TABLE `kategori_produk`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `keranjang`
--
ALTER TABLE `keranjang`
  ADD PRIMARY KEY (`id_keranjang`),
  ADD UNIQUE KEY `uq_keranjang_user_produk` (`id_peng_fk_k`,`id_prod_fk_k`),
  ADD KEY `fk_keranjang_produk` (`id_prod_fk_k`),
  ADD KEY `fk_keranjang_pengguna` (`id_peng_fk_k`);

--
-- Indexes for table `laporan`
--
ALTER TABLE `laporan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `log_transaksi`
--
ALTER TABLE `log_transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `fk_log_pembayaran` (`id_pem_fk_lm`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD UNIQUE KEY `id_pes_fk_pb` (`id_pes_fk_pb`),
  ADD KEY `idx_status_pembayaran` (`status_pem`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id_pengguna`),
  ADD UNIQUE KEY `nim_nik` (`nim_nik`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id_pesanan`),
  ADD UNIQUE KEY `kode_pesanan` (`kode_pesanan`),
  ADD KEY `fk_pesanan_pengguna` (`id_peng_fk_ps`),
  ADD KEY `idx_status_pesanan` (`status_pesanan`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`),
  ADD KEY `fk_produk_kategori` (`id_kat_fk_p`),
  ADD KEY `idx_produk_expired` (`tgl_kadaluarsa`),
  ADD KEY `idx_produk_status` (`status_produk`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  MODIFY `id_detail` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `diskon`
--
ALTER TABLE `diskon`
  MODIFY `id_diskon` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `gambar`
--
ALTER TABLE `gambar`
  MODIFY `id_gambar` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `kategori_produk`
--
ALTER TABLE `kategori_produk`
  MODIFY `id_kategori` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `keranjang`
--
ALTER TABLE `keranjang`
  MODIFY `id_keranjang` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `laporan`
--
ALTER TABLE `laporan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_transaksi`
--
ALTER TABLE `log_transaksi`
  MODIFY `id_transaksi` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id_pembayaran` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id_pengguna` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id_pesanan` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

-- --------------------------------------------------------

--
-- Structure for view `vw_produk_diskon`
--
DROP TABLE IF EXISTS `vw_produk_diskon`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_produk_diskon`  AS SELECT `p`.`id_produk` AS `id_produk`, `p`.`nama_produk` AS `nama_produk`, `p`.`harga_jual` AS `harga_jual`, `d`.`persen_diskon` AS `persen_diskon`, (`p`.`harga_jual` - `d`.`harga_diskon`) AS `harga_setelah_diskon` FROM (`produk` `p` join `diskon` `d` on((`d`.`id_prod_fk_d` = `p`.`id_produk`))) ;

-- --------------------------------------------------------

--
-- Structure for view `vw_produk_hampir_expired`
--
DROP TABLE IF EXISTS `vw_produk_hampir_expired`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_produk_hampir_expired`  AS SELECT `produk`.`id_produk` AS `id_produk`, `produk`.`nama_produk` AS `nama_produk`, `produk`.`stok` AS `stok`, `produk`.`tgl_kadaluarsa` AS `tgl_kadaluarsa`, (to_days(`produk`.`tgl_kadaluarsa`) - to_days(curdate())) AS `sisa_hari` FROM `produk` WHERE ((to_days(`produk`.`tgl_kadaluarsa`) - to_days(curdate())) <= 30) ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD CONSTRAINT `fk_detail_pesanan` FOREIGN KEY (`id_pes_fk_dp`) REFERENCES `pesanan` (`id_pesanan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detail_produk` FOREIGN KEY (`id_prod_fk_dp`) REFERENCES `produk` (`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `diskon`
--
ALTER TABLE `diskon`
  ADD CONSTRAINT `fk_diskon_produk` FOREIGN KEY (`id_prod_fk_d`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `gambar`
--
ALTER TABLE `gambar`
  ADD CONSTRAINT `fk_gambar_produk` FOREIGN KEY (`id_prod_fk_g`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `keranjang`
--
ALTER TABLE `keranjang`
  ADD CONSTRAINT `fk_keranjang_pengguna` FOREIGN KEY (`id_peng_fk_k`) REFERENCES `pengguna` (`id_pengguna`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_keranjang_produk` FOREIGN KEY (`id_prod_fk_k`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `log_transaksi`
--
ALTER TABLE `log_transaksi`
  ADD CONSTRAINT `fk_log_pembayaran` FOREIGN KEY (`id_pem_fk_lm`) REFERENCES `pembayaran` (`id_pembayaran`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `fk_pembayaran_pesanan` FOREIGN KEY (`id_pes_fk_pb`) REFERENCES `pesanan` (`id_pesanan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `fk_pesanan_pengguna` FOREIGN KEY (`id_peng_fk_ps`) REFERENCES `pengguna` (`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `produk`
--
ALTER TABLE `produk`
  ADD CONSTRAINT `fk_produk_kategori` FOREIGN KEY (`id_kat_fk_p`) REFERENCES `kategori_produk` (`id_kategori`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
