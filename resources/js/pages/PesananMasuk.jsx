import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
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

    const [pesananMasuk, setPesananMasuk] = useState([
        {
            id: 1,
            kode: "ORD-WLHW1S",
            nama: "MrBeast",
            tanggal: "2026-06-29",
            jam: "12.03 WIB",
            metode: "QRIS",
            total: 2000,
            item: "Mie Ayam",
            qty: 1,
            status: "menunggu",
        },
        {
            id: 2,
            kode: "ORD-IKYFE6",
            nama: "MrBeast",
            tanggal: "2026-06-29",
            jam: "09.57 WIB",
            metode: "QRIS",
            total: 4000,
            item: "Es Teh",
            qty: 1,
            status: "menunggu",
        },
        {
            id: 3,
            kode: "ORD-VMLX0J",
            nama: "MrBeast",
            tanggal: "2026-06-29",
            jam: "09.44 WIB",
            metode: "QRIS",
            total: 1000,
            item: "Air Mineral",
            qty: 1,
            status: "menunggu",
        },
        {
            id: 4,
            kode: "ORD-SBE06Q",
            nama: "MrBeast",
            tanggal: "2026-06-28",
            jam: "16.22 WIB",
            metode: "QRIS",
            total: 13000,
            item: "Nasi Goreng",
            qty: 1,
            status: "menunggu",
        },
        {
            id: 5,
            kode: "ORD-PLX9RT",
            nama: "MrBeast",
            tanggal: "2026-06-28",
            jam: "10.15 WIB",
            metode: "QRIS",
            total: 7000,
            item: "Bakso",
            qty: 1,
            status: "menunggu",
        },
    ]);

    const handleSelesai = (id) => {
        setPesananMasuk(
            pesananMasuk.map((item) =>
                item.id === id
                    ? { ...item, status: "Selesai" }
                    : item
            )
        );

        setSelectedOrder(null);
    };

    const filteredData = pesananMasuk.filter((item) => {

        const cari =
            item.kode.toLowerCase().includes(search.toLowerCase()) ||
            item.nama.toLowerCase().includes(search.toLowerCase());

        const status =
            filterStatus === "" ||
            item.status === filterStatus;

        const tanggal =
            filterTanggal === "" ||
            item.tanggal === filterTanggal;

        return cari && status && tanggal;

    });
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
        cursor-pointer
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

                            <p className="text-gray-500">
                                Total Pesanan
                            </p>

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
        cursor-pointer
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

                            <p className="text-gray-500">
                                Total Item
                            </p>

                            <h2 className="text-3xl font-bold">
                                {pesananMasuk.reduce(
                                    (a, b) => a + b.qty,
                                    0
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
        cursor-pointer
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

                            <p className="text-gray-500">
                                Total Nilai
                            </p>

                            <h2 className="text-2xl font-bold">

                                Rp{" "}

                                {pesananMasuk
                                    .reduce(
                                        (a, b) => a + b.total,
                                        0
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
        cursor-pointer
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
                            <p className="text-gray-500">
                                Menunggu Konfirmasi
                            </p>

                            <h2 className="text-3xl font-bold">
                                {
                                    pesananMasuk.filter(
                                        item => item.status === "menunggu"
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
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
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
                            onChange={(e) =>
                                setFilterStatus(e.target.value)
                            }
                            className="border rounded-xl px-4 py-3"
                        >
                            <option value="">
                                Semua Status
                            </option>

                            <option value="menunggu">
                                Menunggu
                            </option>

                            <option value="Selesai">
                                Selesai
                            </option>
                        </select>

                        <input
                            type="date"
                            value={filterTanggal}
                            onChange={(e) =>
                                setFilterTanggal(e.target.value)
                            }
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

                                <th className="px-6 py-4 text-center">
                                    Aksi
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredData.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="py-16 text-center text-gray-500"
                                    >

                                        Tidak ada pesanan.

                                    </td>

                                </tr>

                            ) : (

                                filteredData.map((item, index) => (

                                    <tr
                                        key={item.id}
                                        className="border-t hover:bg-blue-50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.01]"
                                    >
                                        <td className="px-6 py-5">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-5">

                                            <div>

                                                <p className="font-semibold text-gray-800">
                                                    {item.kode}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {item.metode}
                                                </p>

                                            </div>

                                        </td>

                                        <td className="px-6 py-5">

                                            <div>

                                                <p className="font-medium">
                                                    {item.nama}
                                                </p>

                                            </div>

                                        </td>

                                        <td className="px-6 py-5">

                                            <div>

                                                <p className="font-medium">
                                                    {item.item}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {item.qty} Item
                                                </p>

                                            </div>

                                        </td>

                                        <td className="px-6 py-5 font-semibold text-blue-600">

                                            Rp {item.total.toLocaleString("id-ID")}

                                        </td>

                                        <td className="px-6 py-5">

                                            <div>

                                                {new Date(item.tanggal).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}

                                                <p className="text-sm text-gray-500">
                                                    {item.jam}
                                                </p>

                                            </div>

                                        </td>

                                        <td className="px-6 py-5">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Selesai"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >

                                                {item.status}

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

                {/* MODAL DETAIL */}

                {selectedOrder && (

                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                        <div className="bg-white rounded-3xl w-[430px] shadow-xl overflow-hidden">

                            {/* Header */}

                            <div className="bg-blue-600 text-white p-6">

                                <h2 className="text-2xl font-bold">
                                    Detail Pesanan
                                </h2>

                                <p className="text-blue-100 mt-1">
                                    {selectedOrder.kode}
                                </p>

                            </div>

                            {/* Body */}

                            <div className="p-6 space-y-5">

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Nama Pembeli
                                    </span>

                                    <span className="font-semibold">
                                        {selectedOrder.nama}
                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Tanggal
                                    </span>

                                    <span>
                                        {selectedOrder.tanggal}
                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Jam
                                    </span>

                                    <span>
                                        {selectedOrder.jam}
                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Metode
                                    </span>

                                    <span>
                                        {selectedOrder.metode}
                                    </span>

                                </div>

                                <hr />

                                <div>

                                    <p className="text-gray-500 text-sm mb-3">
                                        ITEM PESANAN
                                    </p>

                                    <div className="bg-gray-50 rounded-xl p-4">

                                        <div className="flex justify-between">

                                            <div>

                                                <h3 className="font-semibold">
                                                    {selectedOrder.item}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    Qty : {selectedOrder.qty}
                                                </p>

                                            </div>

                                            <div className="font-bold text-blue-600">

                                                Rp{" "}

                                                {selectedOrder.total.toLocaleString(
                                                    "id-ID"
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="flex justify-between items-center">

                                    <span className="text-gray-500 font-medium">
                                        Total Pembayaran
                                    </span>

                                    <span className="text-2xl font-bold text-blue-600">

                                        Rp{" "}

                                        {selectedOrder.total.toLocaleString(
                                            "id-ID"
                                        )}

                                    </span>

                                </div>

                            </div>

                            {/* Footer */}

                            <div className="border-t p-5 flex gap-3">

                                {selectedOrder.status !== "Selesai" && (

                                    <button
                                        onClick={() =>
                                            handleSelesai(selectedOrder.id)
                                        }
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition"
                                    >

                                        <CheckCircle size={18} />

                                        Tandai Selesai

                                    </button>

                                )}

                                <button
                                    onClick={() =>
                                        setSelectedOrder(null)
                                    }
                                    className="flex-1 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl transition"
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