import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import api from "../api";
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";
import DetailPesananModal from "../components/DetailPesananModal";
import {
    Package,
    Eye,
    Search,
    Clock,
    Wallet,
    CalendarDays,
    ShoppingBag,
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleUpdateStatus = async (id, currentStatus) => {
        if (isSubmitting) return;

        let nextStatus = '';
        if (currentStatus === 'menunggu') nextStatus = 'diproses';
        else if (currentStatus === 'diproses') nextStatus = 'siap diambil';
        else if (currentStatus === 'siap diambil') nextStatus = 'selesai';

        if (!nextStatus) return;

        setIsSubmitting(true);
        try {
            await api.put(`/admin/pesanan/${id}/status`, { status: nextStatus });
            await fetchPesanan();
            setSelectedOrder(null);
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Status pesanan berhasil diperbarui",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: error.response?.data?.message || 'Gagal mengubah status',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    const getNextActionLabel = (status) => {
        if (status === 'menunggu') return 'Proses Pesanan';
        if (status === 'diproses') return 'Siap Diambil';
        if (status === 'siap diambil') return 'Selesaikan';
        return '';
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
            "belum bayar": "Belum Bayar",
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
            "belum bayar": "bg-yellow-100 text-yellow-700",
            menunggu: "bg-amber-100 text-amber-700",
            diproses: "bg-blue-100 text-blue-700",
            "siap diambil": "bg-purple-100 text-purple-700",
            selesai: "bg-green-100 text-green-700",
            dibatalkan: "bg-red-100 text-red-700",
        };
        return classes[status] || "bg-gray-100 text-gray-700";
    };
    return (
        <AppLayout role="admin" showFooter={false}>
            <div className="w-full">
                {/* HEADER */}

                {/* HEADER */}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Pesanan Masuk
                        </h1>

                        <p className="text-sm text-gray-500">
                            Daftar pesanan pelanggan koperasi
                        </p>
                    </div>
                </div>

                {/* STATISTIK */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <div
                        className="
        group
        relative
        bg-white
        p-4
        rounded-xl
        shadow-sm
        flex
        items-center
        gap-3
        w-full
        overflow-hidden
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-default
    "
                    >
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                            <ShoppingBag size={18} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Pesanan
                            </p>

                            <h2 className="text-lg font-semibold">
                                {pesananMasuk.length}
                            </h2>
                        </div>
                    </div>

                    <div
                        className="
        group
        relative
        bg-white
        p-4
        rounded-xl
        shadow-sm
        flex
        items-center
        gap-3
        w-full
        overflow-hidden
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-default
    "
                    >
                        <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                            <Package size={18} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Item</p>

                            <h2 className="text-lg font-semibold">
                                {pesananMasuk.reduce(
                                    (a, b) => a + getTotalQty(b.detail_pesanan),
                                    0,
                                )}
                            </h2>
                        </div>
                    </div>

                    <div
                        className="
        group
        relative
        bg-white
        p-4
        rounded-xl
        shadow-sm
        flex
        items-center
        gap-3
        w-full
        overflow-hidden
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-default
    "
                    >
                        <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                            <Wallet size={18} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Total Nilai</p>

                            <h2 className="text-lg font-semibold">
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
        group
        relative
        bg-white
        p-4
        rounded-xl
        shadow-sm
        flex
        items-center
        gap-3
        w-full
        overflow-hidden
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-default
    "
                    >
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                            <Clock size={18} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Menunggu</p>

                            <h2 className="text-lg font-semibold">
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

                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                        {/* Search */}
                        <div className="relative w-full lg:w-72">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder="Cari pesanan..."
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex flex-wrap gap-2">

                            <input
                                type="date"
                                value={filterTanggal}
                                onChange={(e) => setFilterTanggal(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm"
                            />

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Semua Status</option>
                                <option value="belum bayar">Belum Bayar</option>
                                <option value="menunggu">Menunggu</option>
                                <option value="diproses">Diproses</option>
                                <option value="siap diambil">Siap Diambil</option>
                                <option value="selesai">Selesai</option>
                                <option value="dibatalkan">Dibatalkan</option>
                            </select>

                            <button
                                onClick={() => {
                                    setFilterStatus("");
                                    setFilterTanggal("");
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                            >
                                Reset
                            </button>

                        </div>

                    </div>

                </div>

                {/* TABLE */}

                <div className="bg-white rounded-xl shadow-sm">
    <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr className="text-left text-gray-600">
                                <th className="px-4 py-3">No</th>

                                <th className="px-4 py-3">Kode Pesanan</th>

                                <th className="px-4 py-3">Pelanggan</th>

                                <th className="px-4 py-3">Item</th>

                                <th className="px-4 py-3">Total</th>

                                <th className="px-4 py-3">Tanggal</th>

                                <th className="px-4 py-3">Status</th>

                                <th className="px-4 py-3 text-center">Aksi</th>
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
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="border-b border-gray-100 px-4 py-3">
                                            {indexOfFirstItem + index + 1}
                                        </td>

                                        <td className="border-b border-gray-100 px-4 py-3">
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

                                        <td className="border-b border-gray-100 px-4 py-3">
                                            <div>
                                                <p className="font-medium">
                                                    {item.pengguna?.nama || "-"}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="border-b border-gray-100 px-4 py-3">
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

                                        <td className="border-b border-gray-100 px-4 py-3">
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

                                        <td className="border-b border-gray-100 px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(item.status_pesanan)}`}
                                            >
                                                {getStatusLabel(
                                                    item.status_pesanan,
                                                )}
                                            </span>
                                        </td>

                                        <td className="border-b border-gray-100 px-4 py-3">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() =>
                                                        setSelectedOrder(item)
                                                    }
                                                    className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md text-xs hover:bg-blue-50 flex items-center gap-1 transition"
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
</div> {/* overflow-x-auto */}
</div> {/* bg-white */}
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

                <DetailPesananModal
                    selectedOrder={selectedOrder}
                    setSelectedOrder={setSelectedOrder}
                    formatTanggal={formatTanggal}
                    getStatusClass={getStatusClass}
                    getStatusLabel={getStatusLabel}
                    handleUpdateStatus={handleUpdateStatus}
                    getNextActionLabel={getNextActionLabel}
                    isSubmitting={isSubmitting}
                />
            </div>
        </AppLayout>
    );
}
