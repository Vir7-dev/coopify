-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 30, 2026 at 04:03 AM
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

        IF p_status_transaksi = 'lunas' THEN

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

        ELSEIF p_status_transaksi = 'kadaluarsa' THEN

            UPDATE pembayaran
            SET status_pem = 'kadaluarsa'
            WHERE id_pembayaran = p_id_pembayaran;

            UPDATE pesanan
            SET status_pesanan = 'kadaluarsa'
            WHERE id_pesanan = v_id_pesanan;

            -- Kembalikan stok produk
            UPDATE produk p
            INNER JOIN detail_pesanan dp ON dp.id_prod_fk_dp = p.id_produk
            SET p.stok = p.stok + dp.jml_peritem
            WHERE dp.id_pes_fk_dp = v_id_pesanan;

            SET p_pesan = 'Pembayaran kadaluarsa';

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
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

--
-- Dumping data for table `detail_pesanan`
--

INSERT INTO `detail_pesanan` (`id_detail`, `jml_peritem`, `harga_saat_pesan`, `diskon_saat_pesan`, `subtotal_dp`, `id_pes_fk_dp`, `id_prod_fk_dp`) VALUES
(3, 2, 4000.00, 0.00, 8000.00, 3, 17),
(4, 1, 5000.00, 0.00, 5000.00, 4, 16),
(5, 1, 4000.00, 0.00, 4000.00, 5, 17),
(6, 1, 4000.00, 0.00, 4000.00, 6, 17),
(7, 1, 7000.00, 0.00, 7000.00, 7, 24);

-- --------------------------------------------------------

--
-- Table structure for table `diskon`
--

CREATE TABLE `diskon` (
  `id_diskon` int NOT NULL,
  `harga_diskon` decimal(15,2) NOT NULL DEFAULT '0.00',
  `persen_diskon` decimal(5,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `diskon`
--

INSERT INTO `diskon` (`id_diskon`, `harga_diskon`, `persen_diskon`) VALUES
(1, 2000.00, 13.33),
(2, 3000.00, 16.67),
(3, 1000.00, 12.50),
(4, 3000.00, 15.00),
(5, 2000.00, 13.33),
(21, 5000.00, 10.00),
(22, 5000.00, 10.00),
(23, 0.00, 5.00);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(15, 'produk/d4Bfo3VDLMAEAKuKXBj07Nnayv2fsP7pGIHirFpB.jpg', 16),
(16, 'produk/DQom4tN8iyChMFH3sUnLBGgWMF6W8Wsphu6KkCL3.jpg', 16),
(17, 'produk/6xFNHhNobFslZgH2rxk9IzlgBarziQt6lOPVvN51.jpg', 17),
(18, 'produk/aZw3Cf5eTmvOFuu02kkjhaIlSsvDi58IxlEoMC5F.jpg', 18),
(21, 'produk/zMV7xDZw4gUS0CzsqJUoEOacGBkG4hzQSJVbJ6Hj.png', 23),
(22, 'produk/oQJLB5A9idmE34gdPjcxvGqj9AH2Ssi0u0nQEjjZ.jpg', 24);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 'Makanan 2', 'FaUtensils', '2024-01-01 08:00:00'),
(2, 'Minuman', 'FaMugHot', '2024-01-01 08:00:00'),
(3, 'Obat & Kesehatan', 'FaPills', '2024-01-01 08:00:00'),
(4, 'Alat tulis', 'FaUtensils', '2024-01-01 08:00:00'),
(5, 'Almamater', 'FaTshirt', '2024-01-01 08:00:00'),
(27, 'Perlengkapan', 'FaBox', '2026-06-15 00:04:29');

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
(14, 1, 16, 47),
(15, 1, 16, 46);

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

--
-- Dumping data for table `log_transaksi`
--

INSERT INTO `log_transaksi` (`id_transaksi`, `id_transaksi_ext`, `id_pem_fk_lm`, `status_transaksi`, `jumlah_bayar`, `kunci_tanda_tangan`, `waktu_transaksi`, `payload_midtrans`) VALUES
(1, '3b601a2a-58fd-4482-a91d-8616674f4d83', 6, 'menunggu', 4000.00, '2195fda68d1996df3106a889b2f950515b7cf431af822ac561523780ffbb6427f5304dfd9b12c03651a2eaf2a265495cdf7d55989612bb9c54d52c6735ddf398', '2026-06-26 10:31:48', NULL),
(2, 'f5cc116b-b30b-4089-b0b2-cc5e4bf342c9', 5, 'gagal', 4000.00, '40b5c40aba1eb7fd83f4626d7dace0593f49b9d03bb8f6a2dfaad730220eefb1f35399b789cafd688155063e37fc3d56878eb0b7fe6243511785ed945a879db6', '2026-06-26 10:39:10', NULL),
(3, '3b601a2a-58fd-4482-a91d-8616674f4d83', 6, 'gagal', 4000.00, 'a7a4a48e4c8686ef2754c7e9c1f1518315ea9910051cdb615446a80419e582e5c109035a4a9409e2feb87da627e7ee03a92f77c2ff7e502e351027f2287e6f19', '2026-06-26 10:47:49', NULL),
(4, '91d4ae95-5c40-4980-908e-55fe4cb416c6', 7, 'menunggu', 7000.00, '8ebbb7efcc474d538b8ac839b0b024b662b92e81bc7fd7aac4d20667bd4622a9e492b523af4c962c682b3786d739846c3ec6704b3da9ab5a3ab58a8c99df2ac9', '2026-06-29 10:02:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2026_04_29_021350_create_sessions_table', 1),
(4, '2026_06_01_154543_create_personal_access_tokens_table', 1);

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
-- Dumping data for table `pembayaran`
--

INSERT INTO `pembayaran` (`id_pembayaran`, `status_pem`, `total_bayar`, `batas_wkt_pem`, `id_pes_fk_pb`, `snap_token`, `midtrans_transaction_id`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, 'menunggu', 52000.00, '2026-06-19 16:03:27', 1, NULL, NULL, NULL, '2026-06-19 08:03:27', '2026-06-19 08:03:27'),
(2, 'menunggu', 15000.00, '2026-06-19 17:07:27', 2, NULL, NULL, NULL, '2026-06-19 09:07:27', '2026-06-19 09:07:27'),
(3, 'menunggu', 8000.00, '2026-06-24 16:23:01', 3, '74fa8af0-3d29-4c5f-b214-d6555fbaa06e', NULL, NULL, '2026-06-24 08:23:01', '2026-06-24 08:23:03'),
(4, 'menunggu', 5000.00, '2026-06-26 10:49:59', 4, 'c967e02b-8e08-4acd-825f-ac6ab0e974a4', NULL, NULL, '2026-06-26 02:49:59', '2026-06-26 02:50:01'),
(5, 'gagal', 4000.00, '2026-06-26 11:23:06', 5, 'e8081bff-dd4e-4d65-ad09-bb232bf52c67', NULL, NULL, '2026-06-26 03:23:06', '2026-06-26 03:39:10'),
(6, 'gagal', 4000.00, '2026-06-26 11:31:45', 6, '656988ef-3caa-4645-bcbd-a4744b7fb375', NULL, NULL, '2026-06-26 03:31:45', '2026-06-26 03:47:49'),
(7, 'menunggu', 7000.00, '2026-06-29 10:54:01', 7, 'f13ae0b4-14f1-4b9a-ac58-591394393e40', NULL, NULL, '2026-06-29 02:54:01', '2026-06-29 02:54:03');

--
-- Triggers `pembayaran`
--
DELIMITER $$
CREATE TRIGGER `trg_cek_kadaluarsa_pembayaran` BEFORE UPDATE ON `pembayaran` FOR EACH ROW BEGIN
    IF NEW.status_pem = 'menunggu' AND NOW() > NEW.batas_wkt_pem THEN
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
(21, '2021002', 'Budi Santoso', 'budi@email.com', '081234567891', 'foto/budi.jpg', 'pengguna', '$2y$12$Fvo8KQq5Ux7ctTzniKlxHuLiw09AI6rsdGBvECLTvAccdczlcQxqe', '2026-06-05 03:26:04', '2026-06-06 08:30:16'),
(22, '2021003', 'Citra Dewi', 'citra@email.com', '081234567892', NULL, 'pengguna', '$2y$10$abcdefghijklmnopqrstuuVwXyZ0123456789ABCDEFGHIJKLMNOPQRs', '2026-06-05 03:26:04', '2026-06-05 03:26:04'),
(23, '2021004', 'Dina Rahma', 'dina@email.com', '081234567893', 'foto/dina.jpg', 'pengguna', '$2y$10$abcdefghijklmnopqrstuuVwXyZ0123456789ABCDEFGHIJKLMNOPQRs', '2026-06-05 03:26:04', '2026-06-05 03:26:04'),
(24, '2021005', 'Eko Wijaya', 'eko@email.com', '081234567894', NULL, 'pengguna', '$2y$10$abcdefghijklmnopqrstuuVwXyZ0123456789ABCDEFGHIJKLMNOPQRs', '2026-06-05 03:26:04', '2026-06-05 03:26:04'),
(43, '1234567', 'winda', 'winda1@gmail.com', '0811696599', NULL, 'pengguna', '$2y$12$eJ1lw6Plq/BG730KDjnmFeY5c5grqdjKXMq7LvDQCKTOQ9yQ/JYiO', '2026-06-06 08:36:20', '2026-06-06 08:39:21'),
(44, '1122334455', 'windawin', 'winda@gmail.com', '08116965991', NULL, 'admin', '$2y$12$eMQNGWvazaKM1p6RTXIC5uTttGaQQyWDa5mwdYxuPHgzKNJZ2SfMG', '2026-06-14 16:33:17', '2026-06-14 16:58:30'),
(45, '4342501022', 'Citra kece', 'citra10@gmail.com', '08116569899', NULL, 'pengguna', '$2y$12$3q3oBLLysysha79Yxzhr4.ynNqRlfvJmj/QdL8fRoLX/vZRfusvCq', '2026-06-18 09:19:11', '2026-06-18 09:19:11'),
(46, '4342501003', 'fathia', 'fathia@gmail.com', '081165698990', NULL, 'pengguna', '$2y$12$1fXCnyk2ttovfHbW/ldaouMkaJOdr0RB6X2uvcYvGYmh4Tw1p7BhC', '2026-06-18 12:13:18', '2026-06-19 08:36:09'),
(47, '4342501001', 'winda', 'winda2gmail.com', NULL, NULL, 'admin', '$2y$12$iSg.OizPOtEyEN8/nuBGc.xiqEGCDw3ZOkq7psGAnFq17ONrrAAUu', '2026-06-18 12:33:40', '2026-06-18 12:34:10'),
(48, '271001', 'MrBeast', 'mrbeast@gmail.com', '087767676767', NULL, 'pengguna', '$2y$12$OcfGpLKF975oDgYMSboocuH4YjxXohcyQf0/L71zuCgYRtVwmO9ge', '2026-06-23 07:22:15', '2026-06-23 07:22:15'),
(49, '271110', 'Adminvir', 'adminvir@gmail.com', '081277123489', NULL, 'admin', '$2y$12$g9.SNS7xDYtiF1F0FeWbVuKV5Cz5NGp9Z.oPUKkLnHuSVL7LHNqWC', '2026-06-26 02:41:18', '2026-06-26 02:41:18');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 44, 'auth_token', '6c24e63d7550c60cce31bc023212fffd8dbf7c7e2b8299250ac715d2b0f08a45', '[\"*\"]', '2026-06-14 17:29:03', NULL, '2026-06-14 16:58:39', '2026-06-14 17:29:03'),
(2, 'App\\Models\\User', 45, 'auth_token', 'de011fd3c79fde1e7508c2ed18637d0cc17f240f71b89e4f476dd6c5d091f9b4', '[\"*\"]', NULL, NULL, '2026-06-18 09:19:42', '2026-06-18 09:19:42'),
(6, 'App\\Models\\User', 47, 'auth_token', '31ed47bb04def5b35e8403265ceb2cfca15237742ce13599be6dae16c849753e', '[\"*\"]', '2026-06-18 12:55:35', NULL, '2026-06-18 12:34:20', '2026-06-18 12:55:35'),
(13, 'App\\Models\\User', 46, 'auth_token', 'd731af0997e4d3e9f1cf3601bf6f4aaf69ac42633c3f19c341b7300c720d3c13', '[\"*\"]', '2026-06-19 08:00:51', NULL, '2026-06-19 07:33:35', '2026-06-19 08:00:51'),
(24, 'App\\Models\\User', 46, 'auth_token', 'e373590b0ee4b8e13cb5b65b7d7c55df354ce6063cb3148784ed85ee6564cb77', '[\"*\"]', '2026-06-21 14:44:38', NULL, '2026-06-21 14:44:07', '2026-06-21 14:44:38'),
(25, 'App\\Models\\User', 48, 'auth_token', 'bd34f4e1a04d4184eace1bd97a5883d9f39f1ce66e8bc19c7b1945952e2bd7ad', '[\"*\"]', NULL, NULL, '2026-06-23 07:31:35', '2026-06-23 07:31:35'),
(26, 'App\\Models\\User', 48, 'auth_token', '3414e38cf1ee63604fedc95f716d5e3d6e5f9ba04ff2a23aa6504f38bfbbd0a7', '[\"*\"]', '2026-06-23 08:54:36', NULL, '2026-06-23 07:31:36', '2026-06-23 08:54:36'),
(28, 'App\\Models\\User', 48, 'auth_token', 'da4a866a308d236bf0cd8b8e97080792fd99a1afdcb8a6b7d96f9eab9e3dc52a', '[\"*\"]', '2026-06-24 12:47:09', NULL, '2026-06-24 08:50:05', '2026-06-24 12:47:09'),
(30, 'App\\Models\\User', 48, 'auth_token', '8b769b7c0cdfba891d495b0e993d89d469ccdf3455e15b5152b0cd5e51c42ecb', '[\"*\"]', '2026-06-26 04:01:00', NULL, '2026-06-26 02:49:47', '2026-06-26 04:01:00'),
(31, 'App\\Models\\User', 48, 'auth_token', 'adf170abb28e4ca58b5f6de79f62c55bee8e7d449a89f1488e3bf2d541d13f71', '[\"*\"]', NULL, NULL, '2026-06-27 02:25:05', '2026-06-27 02:25:05'),
(32, 'App\\Models\\User', 48, 'auth_token', 'a2464cb61aa5a8a86ee97f17d5f24cd9ec95d4a0233b021a767de17a1630685d', '[\"*\"]', '2026-06-27 02:25:24', NULL, '2026-06-27 02:25:07', '2026-06-27 02:25:24'),
(33, 'App\\Models\\User', 48, 'test', '69cbe15d36f3c45012553fc7212d9e84da944ab671fa24258f4c3307b926a5a5', '[\"*\"]', NULL, NULL, '2026-06-27 02:50:38', '2026-06-27 02:50:38'),
(34, 'App\\Models\\User', 48, 'auth_token', '8f4a1147ecf0749c4ef5ac01670b70c88a4f9e3c40cee16dae50d421a0dc1b74', '[\"*\"]', '2026-06-27 04:48:13', NULL, '2026-06-27 04:47:20', '2026-06-27 04:48:13'),
(35, 'App\\Models\\User', 48, 'auth_token', '931df8a191617ae7cbd09cfee7d281e7e83d32f0c6c142d971c16bfe95ef14ee', '[\"*\"]', '2026-06-27 05:41:39', NULL, '2026-06-27 04:48:24', '2026-06-27 05:41:39'),
(36, 'App\\Models\\User', 48, 'auth_token', 'e5838bc9309cd5aa7ec6c2147ee0ebf3ad366094d92a2d555bd6074dc63997f8', '[\"*\"]', '2026-06-27 04:56:11', NULL, '2026-06-27 04:55:52', '2026-06-27 04:56:11'),
(37, 'App\\Models\\User', 49, 'auth_token', '7b702f12ffde41478520bcbcf1c133b1de53c1f4c30c3104128d2f975195cd95', '[\"*\"]', '2026-06-27 05:02:00', NULL, '2026-06-27 04:56:44', '2026-06-27 05:02:00'),
(38, 'App\\Models\\User', 48, 'auth_token', 'f8925b45349979162274477d131edf5b6ec817992b2dcaaeb566b07d03810914', '[\"*\"]', '2026-06-27 05:16:28', NULL, '2026-06-27 05:02:22', '2026-06-27 05:16:28'),
(39, 'App\\Models\\User', 48, 'auth_token', 'a3b6d717e9ad59aa6d9add0a2f149fb3255ed6f394691d24fcd5442c1bcc736c', '[\"*\"]', '2026-06-27 05:40:54', NULL, '2026-06-27 05:15:31', '2026-06-27 05:40:54'),
(44, 'App\\Models\\User', 48, 'auth_token', '63d651970448acdb02c9f06300f09e3b7b6c6a69042f116d4a3d1bcd2c2bcb8e', '[\"*\"]', '2026-06-27 05:43:18', NULL, '2026-06-27 05:41:21', '2026-06-27 05:43:18'),
(46, 'App\\Models\\User', 48, 'auth_token', 'c1e84f2d2a03cbe90cb1ec9a82983fc49ed7a0185ad10941382ba18965b172a6', '[\"*\"]', '2026-06-27 05:53:22', NULL, '2026-06-27 05:43:30', '2026-06-27 05:53:22'),
(47, 'App\\Models\\User', 49, 'auth_token', 'da430fee056526f2a8be214a1b166dad173fe53567acdf7029cbebee07588b0f', '[\"*\"]', '2026-06-27 05:44:38', NULL, '2026-06-27 05:43:46', '2026-06-27 05:44:38'),
(48, 'App\\Models\\User', 48, 'auth_token', '88978b2c8062c991c1d75184c5bfc9bf7831cc5fe3ce39a923df6447bf073eda', '[\"*\"]', '2026-06-27 05:46:24', NULL, '2026-06-27 05:44:29', '2026-06-27 05:46:24'),
(50, 'App\\Models\\User', 48, 'auth_token', '846449328055efccede17f5f025f475e2959745349f8a57d23a6ab0c01e52dcf', '[\"*\"]', NULL, NULL, '2026-06-27 06:00:04', '2026-06-27 06:00:04'),
(55, 'App\\Models\\User', 48, 'auth_token', '7fa6c0d4c3275e5bfb9e3aafb933d5a560bee1b78ad54e15d09411541ba221d6', '[\"*\"]', '2026-06-27 06:11:08', NULL, '2026-06-27 06:10:57', '2026-06-27 06:11:08'),
(56, 'App\\Models\\User', 48, 'auth_token', '37cd5ba00b645197f4fc2eb9d1a1961cb03b7a97724092fbe1a068a756bbf890', '[\"*\"]', '2026-06-27 06:12:39', NULL, '2026-06-27 06:12:35', '2026-06-27 06:12:39'),
(57, 'App\\Models\\User', 48, 'auth_token', '049ff17177c606bbdf891b2ff54c65ff1271adbe1df4a29347eb0ad1225a916d', '[\"*\"]', '2026-06-27 06:13:34', NULL, '2026-06-27 06:13:31', '2026-06-27 06:13:34'),
(62, 'App\\Models\\User', 48, 'auth_token', 'f5acf640313bbd9d75005a9b5d62ac15eb149735354d810b78735d7092ee35dc', '[\"*\"]', NULL, NULL, '2026-06-28 13:25:59', '2026-06-28 13:25:59'),
(63, 'App\\Models\\User', 48, 'auth_token', 'efdf95fb3cbe4e84b7c1569f73a22fd480dd6985db4d060ca112b3fa2e006701', '[\"*\"]', '2026-06-28 13:29:50', NULL, '2026-06-28 13:25:59', '2026-06-28 13:29:50'),
(64, 'App\\Models\\User', 48, 'auth_token', '95f00e932990d5d37ad1b6bcdb239bc4609e0d982048725d1d15a68855ff0b20', '[\"*\"]', NULL, NULL, '2026-06-29 02:53:54', '2026-06-29 02:53:54'),
(65, 'App\\Models\\User', 48, 'auth_token', 'e5f5f40bd3d09108168f21632681574ea233bb04c67a4f40fa70aee3b93c5305', '[\"*\"]', NULL, NULL, '2026-06-29 02:53:55', '2026-06-29 02:53:55'),
(66, 'App\\Models\\User', 48, 'auth_token', 'f7bfcc518d09aef7c75e52ffc84b5babc4abcaaf6b565357174001e02bdab138', '[\"*\"]', '2026-06-29 11:27:21', NULL, '2026-06-29 02:53:55', '2026-06-29 11:27:21'),
(67, 'App\\Models\\User', 49, 'auth_token', '9b05eea3d8e843306037c6bff2fb38576d3953b0ac72586c24ccb0ef39627a2a', '[\"*\"]', '2026-06-29 14:38:54', NULL, '2026-06-29 11:27:37', '2026-06-29 14:38:54'),
(68, 'App\\Models\\User', 49, 'auth_token', 'b2b312a0998f55070b32e6b9a8c1e2d2c944addea6a4ac0a659ed86c918c1d40', '[\"*\"]', '2026-06-30 03:48:18', NULL, '2026-06-30 03:31:16', '2026-06-30 03:48:18');

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

--
-- Dumping data for table `pesanan`
--

INSERT INTO `pesanan` (`id_pesanan`, `kode_pesanan`, `tgl_pesanan`, `wkt_pengambilan`, `status_pesanan`, `total_harga`, `id_peng_fk_ps`) VALUES
(1, 'ORD-WP3L0R', '2026-06-19 15:03:27', NULL, 'menunggu', 52000.00, 46),
(2, 'ORD-CL05CL', '2026-06-19 16:07:27', NULL, 'menunggu', 15000.00, 46),
(3, 'ORD-EBEO5E', '2026-06-24 15:23:01', '2026-06-24 15:52:00', 'menunggu', 8000.00, 48),
(4, 'ORD-E3IFNE', '2026-06-26 09:49:59', '2026-06-26 10:19:00', 'menunggu', 5000.00, 48),
(5, 'ORD-SQ4U8J', '2026-06-26 10:23:06', '2026-06-26 10:53:00', 'menunggu', 4000.00, 48),
(6, 'ORD-SWPKJ8', '2026-06-26 10:31:45', '2026-06-26 11:01:00', 'menunggu', 4000.00, 48),
(7, 'ORD-Z7SLJX', '2026-06-29 09:54:01', '2026-06-29 10:23:00', 'menunggu', 7000.00, 48);

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
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_disk_fk_p` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id_produk`, `nama_produk`, `stok`, `harga_jual`, `tgl_kadaluarsa`, `id_kat_fk_p`, `deskripsi`, `status_produk`, `created_at`, `updated_at`, `id_disk_fk_p`) VALUES
(16, 'Nabati', 9, 5000.00, NULL, 1, 'Nabati lezatt', 'aktif', '2026-06-21 13:34:17', '2026-06-26 02:49:59', 23),
(17, 'teh pucuk', 46, 4000.00, NULL, 2, 'Teh pucuk enak tau', 'aktif', '2026-06-21 13:40:11', '2026-06-26 03:31:45', 23),
(18, 'Potatos', 0, 9000.00, NULL, 1, 'enakk', 'habis', '2026-06-21 13:44:31', '2026-06-21 14:23:10', 21),
(23, 'ayam geprek', 10, 15000.00, NULL, 1, 'enakk', 'aktif', '2026-06-27 05:44:20', '2026-06-27 05:44:44', 23),
(24, 'Es Krim', 24, 7000.00, NULL, 1, 'Es Krim Segar', 'aktif', '2026-06-28 12:59:53', '2026-06-29 02:54:01', NULL);

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
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

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
  ADD PRIMARY KEY (`id_diskon`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `gambar`
--
ALTER TABLE `gambar`
  ADD PRIMARY KEY (`id_gambar`),
  ADD KEY `fk_gambar_produk` (`id_prod_fk_g`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_produk`
--
ALTER TABLE `kategori_produk`
  ADD PRIMARY KEY (`id_kategori`),
  ADD UNIQUE KEY `uq_nama_kategori` (`nama_kategori`);

--
-- Indexes for table `keranjang`
--
ALTER TABLE `keranjang`
  ADD PRIMARY KEY (`id_keranjang`),
  ADD UNIQUE KEY `uq_keranjang_user_produk` (`id_peng_fk_k`,`id_prod_fk_k`),
  ADD KEY `fk_keranjang_produk` (`id_prod_fk_k`),
  ADD KEY `fk_keranjang_pengguna` (`id_peng_fk_k`);

--
-- Indexes for table `log_transaksi`
--
ALTER TABLE `log_transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `fk_log_pembayaran` (`id_pem_fk_lm`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

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
  ADD KEY `idx_produk_status` (`status_produk`),
  ADD KEY `fk_diskon` (`id_disk_fk_p`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  MODIFY `id_detail` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `diskon`
--
ALTER TABLE `diskon`
  MODIFY `id_diskon` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gambar`
--
ALTER TABLE `gambar`
  MODIFY `id_gambar` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_produk`
--
ALTER TABLE `kategori_produk`
  MODIFY `id_kategori` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `keranjang`
--
ALTER TABLE `keranjang`
  MODIFY `id_keranjang` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `log_transaksi`
--
ALTER TABLE `log_transaksi`
  MODIFY `id_transaksi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id_pembayaran` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id_pengguna` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id_pesanan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

-- --------------------------------------------------------

--
-- Structure for view `vw_produk_diskon`
--
DROP TABLE IF EXISTS `vw_produk_diskon`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_produk_diskon`  AS SELECT `p`.`id_produk` AS `id_produk`, `p`.`nama_produk` AS `nama_produk`, `p`.`harga_jual` AS `harga_jual`, `d`.`persen_diskon` AS `persen_diskon`, (`p`.`harga_jual` - `d`.`harga_diskon`) AS `harga_setelah_diskon` FROM (`produk` `p` join `diskon` `d` on((`d`.`id_diskon` = `p`.`id_disk_fk_p`))) ;

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
  ADD CONSTRAINT `fk_diskon` FOREIGN KEY (`id_disk_fk_p`) REFERENCES `diskon` (`id_diskon`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_produk_kategori` FOREIGN KEY (`id_kat_fk_p`) REFERENCES `kategori_produk` (`id_kategori`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
