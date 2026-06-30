import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import api from "../api";
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";
import {
    Package,
    Eye,
    Search,
    Clock,
    Wallet,
    CalendarDays,
    ShoppingBag,
    CheckCircle,
} from "lucide-react";

export default function PesananMasuk() {
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [search, setSearch] = useState("");

    // State untuk filter
    const [filterStatus, setFilterStatus] = useState("");
    const [filterTanggal, setFilterTanggal] = useState("");

    // State untuk data dari API
    const [pesananMasuk, setPesananMasuk] = useState([]);
    const [loading, setLoading] = useState(true);

    // State untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Fetch data pesanan dari API
    const fetchPesanan = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/pesanan");
            setPesananMasuk(res.data);
        } catch (err) {
            console.error("Gagal mengambil data pesanan:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPesanan();
    }, []);

    const handleSelesai = async (id) => {
        try {
            await api.put(`/admin/pesanan/${id}/status`, {
                status: "selesai",
            });

            // Refresh data setelah update
            await fetchPesanan();
            setSelectedOrder(null);

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Pesanan berhasil ditandai selesai",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.message || "Terjadi kesalahan",
            });
        }
    };

    // Helper untuk extract tanggal saja (YYYY-MM-DD) dari timestamp
    // Handle both formats: "2026-06-26 12:30:00" or "2026-06-26T12:30:00.000000Z"
    const getDateOnly = (tanggal) => {
        if (!tanggal) return "";
        // Replace T with space, then take the date part before the time
        const normalized = tanggal.replace("T", " ");
        const datePart = normalized.split(" ")[0];
        return datePart;
    };

    const filteredData = pesananMasuk.filter((item) => {
        const cari =
            item.kode_pesanan?.toLowerCase().includes(search.toLowerCase()) ||
            item.pengguna?.nama?.toLowerCase().includes(search.toLowerCase());

        const status =
            filterStatus === "" || item.status_pesanan === filterStatus;

        // Filter tanggal - bandingkan bagian tanggal saja
        const tanggal =
            filterTanggal === "" ||
            getDateOnly(item.tgl_pesanan) === filterTanggal;

        return cari && status && tanggal;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Reset ke halaman 1 saat filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterStatus, filterTanggal]);

    // Helper format tanggal
    // Handle both formats: "2026-06-26 12:30:00" or "2026-06-26T12:30:00.000000Z"
    const formatTanggal = (tanggal) => {
        if (!tanggal) return "-";
        // Normalize: replace T with space first
        const normalized = tanggal.replace("T", " ");
        // Now split by space to get date part
        const datePart = normalized.split(" ")[0];
        const [year, month, day] = datePart.split("-");
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
    };

    // Helper format jam (konversi ke WIB/UTC+7)
    const formatJam = (tanggal) => {
        if (!tanggal) return "-";

        // Extract time part directly from string
        const timePart = tanggal.includes("T")
            ? tanggal.split("T")[1].split(".")[0]  // ISO format
            : tanggal.split(" ")[1];                  // MySQL format

        if (!timePart) return "-";

        // Parse jam dan tambahkan offset WIB (UTC+7)
        const [hours, minutes] = timePart.split(":").map(Number);
        let newHours = hours + 7;

        // Handle overflow jika lebih dari 24
        if (newHours >= 24) {
            newHours -= 24;
        }

        return `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    // Helper untuk dapat nama item dengan truncate
    // Format: "Item1, Item2 +3 lainnya" jika lebih dari 2 item
    const getItemName = (detailPesanan) => {
        if (!detailPesanan || detailPesanan.length === 0) return "-";

        const names = detailPesanan.map((dp) => dp.produk?.nama_produk).filter(Boolean);

        if (names.length === 0) return "-";
        if (names.length === 1) return names[0];
        if (names.length === 2) return names.join(", ");
        return `${names[0]}, ${names[1]} +${names.length - 2} lainnya`;
    };

    // Helper untuk total qty (field: jml_peritem)
    const getTotalQty = (detailPesanan) => {
        if (!detailPesanan || detailPesanan.length === 0) return 0;
        return detailPesanan.reduce(
            (sum, dp) => sum + (dp.jml_peritem || 0),
            0,
        );
    };

    // Helper untuk label status
    const getStatusLabel = (status) => {
        const labels = {
            menunggu: "Menunggu",
            diproses: "Diproses",
            "siap diambil": "Siap Diambil",
            selesai: "Selesai",
            dibatalkan: "Dibatalkan",
        };
        return labels[status] || status;
    };

    // Helper untuk class status badge
    const getStatusClass = (status) => {
        const classes = {
            menunggu: "bg-yellow-100 text-yellow-700",
            diproses: "bg-blue-100 text-blue-700",
            "siap diambil": "bg-purple-100 text-purple-700",
            selesai: "bg-green-100 text-green-700",
            dibatalkan: "bg-red-100 text-red-700",
        };
        return classes[status] || "bg-gray-100 text-gray-700";
    };
    return (
        <AppLayout role="admin" showFooter={false}>
            <div className="bg-gray-100 min-h-screen p-6">
                {/* HEADER */}

                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Pesanan Masuk
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Daftar pesanan pelanggan koperasi
                    </p>
                </div>

                {/* STATISTIK */}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                    <div
                        className="
        bg-white
        rounded-2xl
        shadow-sm
        p-5
        flex
        items-center
        gap-4
        transition-all
        duration-300
        ease-in-out
        hover:scale-105
        hover:-translate-y-2
        hover:shadow-2xl
        hover:border
        hover:border-[#1766D3]
    "
                    >
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <ShoppingBag className="text-blue-600" />
                        </div>

                        <div>
                            <p className="text-gray-500">Total Pesanan</p>

                            <h2 className="text-3xl font-bold">
                                {pesananMasuk.length}
                            </h2>
                        </div>
                    </div>

                    <div
                        className="
        bg-white
        rounded-2xl
        shadow-sm
        p-5
        flex
        items-center
        gap-4
        transition-all
        duration-300
        ease-in-out
        hover:scale-105
        hover:-translate-y-2
        hover:shadow-2xl
        hover:border
        hover:border-[#1766D3]
    "
                    >
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Package className="text-green-600" />
                        </div>

                        <div>
                            <p className="text-gray-500">Total Item</p>

                            <h2 className="text-3xl font-bold">
                                {pesananMasuk.reduce(
                                    (a, b) => a + getTotalQty(b.detail_pesanan),
                                    0,
                                )}
                            </h2>
                        </div>
                    </div>

                    <div
                        className="
        bg-white
        rounded-2xl
        shadow-sm
        p-5
        flex
        items-center
        gap-4
        transition-all
        duration-300
        ease-in-out
        hover:scale-105
        hover:-translate-y-2
        hover:shadow-2xl
        hover:border
        hover:border-[#1766D3]
    "
                    >
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <Wallet className="text-orange-600" />
                        </div>

                        <div>
                            <p className="text-gray-500">Total Nilai</p>

                            <h2 className="text-2xl font-bold">
                                Rp{" "}
                                {pesananMasuk
                                    .reduce(
                                        (a, b) =>
                                            a +
                                            (parseFloat(b.total_harga) || 0),
                                        0,
                                    )
                                    .toLocaleString("id-ID")}
                            </h2>
                        </div>
                    </div>

                    <div
                        className="
        bg-white
        rounded-2xl
        shadow-sm
        p-5
        flex
        items-center
        gap-4
        transition-all
        duration-300
        ease-in-out
        hover:scale-105
        hover:-translate-y-2
        hover:shadow-2xl
        hover:border
        hover:border-[#1766D3]
    "
                    >
                        <div className="bg-yellow-100 p-3 rounded-xl">
                            <Clock className="text-yellow-600" />
                        </div>

                        <div>
                            <p className="text-gray-500">Menunggu Konfirmasi</p>

                            <h2 className="text-3xl font-bold">
                                {
                                    pesananMasuk.filter(
                                        (item) =>
                                            item.status_pesanan === "menunggu",
                                    ).length
                                }
                            </h2>
                        </div>
                    </div>
                </div>

                {/* SEARCH */}

                <div className="bg-white rounded-2xl shadow-sm mb-6">
                    <div className="p-5">
                        <div className="relative w-full md:w-80">
                            <Search
                                size={18}
                                className="absolute left-3 top-3.5 text-gray-400"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder="Cari pesanan..."
                                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm mb-6 p-5">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border rounded-xl px-4 py-3"
                        >
                            <option value="">Semua Status</option>

                            <option value="menunggu">Menunggu</option>

                            <option value="diproses">Diproses</option>

                            <option value="siap diambil">Siap Diambil</option>

                            <option value="selesai">Selesai</option>

                            <option value="dibatalkan">Dibatalkan</option>
                        </select>

                        <input
                            type="date"
                            value={filterTanggal}
                            onChange={(e) => setFilterTanggal(e.target.value)}
                            className="border rounded-xl px-4 py-3"
                        />

                        <button
                            onClick={() => {
                                setFilterStatus("");
                                setFilterTanggal("");
                            }}
                            className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>

                {/* TABLE */}

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-600">
                                <th className="px-6 py-4">No</th>

                                <th className="px-6 py-4">Kode Pesanan</th>

                                <th className="px-6 py-4">Pelanggan</th>

                                <th className="px-6 py-4">Item</th>

                                <th className="px-6 py-4">Total</th>

                                <th className="px-6 py-4">Tanggal</th>

                                <th className="px-6 py-4">Status</th>

                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-16 text-center text-gray-500"
                                    >
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-16 text-center text-gray-500"
                                    >
                                        Tidak ada pesanan.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr
                                        key={item.id_pesanan}
                                        className="border-t hover:bg-blue-50 transition-all duration-300"
                                    >
                                        <td className="px-6 py-5">
                                            {indexOfFirstItem + index + 1}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {item.kode_pesanan}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {item.pembayaran
                                                        ?.metode_pembayaran ||
                                                        "-"}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="font-medium">
                                                    {item.pengguna?.nama || "-"}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="font-medium">
                                                    {getItemName(
                                                        item.detail_pesanan,
                                                    )}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {getTotalQty(
                                                        item.detail_pesanan,
                                                    )}{" "}
                                                    Item
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 font-semibold text-blue-600">
                                            Rp{" "}
                                            {parseFloat(
                                                item.total_harga || 0,
                                            ).toLocaleString("id-ID")}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div>
                                                {formatTanggal(
                                                    item.tgl_pesanan,
                                                )}

                                                <p className="text-sm text-gray-500">
                                                    {formatJam(
                                                        item.tgl_pesanan,
                                                    )}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(item.status_pesanan)}`}
                                            >
                                                {getStatusLabel(
                                                    item.status_pesanan,
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() =>
                                                        setSelectedOrder(item)
                                                    }
                                                    className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition"
                                                >
                                                    <Eye size={18} />
                                                    Detail
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {filteredData.length > 0 && (
                    <Pagination
                        currentItems={currentItems.length}
                        totalItems={filteredData.length}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        label="pesanan"
                    />
                )}

                {/* MODAL DETAIL */}

                {selectedOrder && (
                    <div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <div
                            className="bg-white rounded-2xl w-[400px] max-h-[85vh] flex flex-col shadow-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-blue-600 text-white p-4 flex-shrink-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-bold">
                                            Detail Pesanan
                                        </h2>
                                        <p className="text-blue-100 text-sm">
                                            {selectedOrder.kode_pesanan}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-white/80 hover:text-white text-2xl leading-none"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>

                            {/* Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-gray-500">Nama</p>
                                        <p className="font-medium">
                                            {selectedOrder.pengguna?.nama || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Tanggal</p>
                                        <p className="font-medium">
                                            {formatTanggal(selectedOrder.tgl_pesanan)}
                                        </p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <p className="text-gray-500 text-sm mb-2">
                                        ITEM ({selectedOrder.detail_pesanan?.length || 0})
                                    </p>
                                    <div className="bg-gray-50 rounded-xl divide-y divide-gray-200 max-h-[200px] overflow-y-auto">
                                        {selectedOrder.detail_pesanan?.map((dp, idx) => (
                                            <div key={idx} className="p-3 flex justify-between items-center">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">
                                                        {dp.produk?.nama_produk || "-"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Qty: {dp.jml_peritem || 0}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-blue-600 text-sm">
                                                    Rp {parseFloat(dp.subtotal_dp || 0).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="bg-blue-50 rounded-xl p-3 flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">
                                        Total
                                    </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        Rp {parseFloat(selectedOrder.total_harga || 0).toLocaleString("id-ID")}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="flex justify-center">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(selectedOrder.status_pesanan)}`}>
                                        {getStatusLabel(selectedOrder.status_pesanan)}
                                    </span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t p-3 flex gap-2 flex-shrink-0">
                                {selectedOrder.status_pesanan !== "selesai" &&
                                    selectedOrder.status_pesanan !== "dibatalkan" && (
                                        <button
                                            onClick={() => handleSelesai(selectedOrder.id_pesanan)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 transition text-sm font-medium"
                                        >
                                            <CheckCircle size={16} />
                                            Tandai Selesai
                                        </button>
                                    )}

                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 rounded-xl transition text-sm font-medium"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
