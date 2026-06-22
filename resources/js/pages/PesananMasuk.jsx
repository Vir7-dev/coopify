import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import {
    Package,
    CheckCircle,
    Eye,
} from "lucide-react";

export default function PesananMasuk() {

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [pesananMasuk, setPesananMasuk] = useState([
        {
            id: 1,
            kode: "ORD-24001",
            nama: "Fikri",
            total: 45000,
            metode: "QRIS",
            tanggal: "22 Juni 2026",
            status: "menunggu",
        },
        {
            id: 2,
            kode: "ORD-24002",
            nama: "Andi",
            total: 32000,
            metode: "QRIS",
            tanggal: "22 Juni 2026",
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
    };

    return (
        <AppLayout role="admin">

            <div className="bg-gray-100 min-h-screen p-6">

                {/* HEADER */}
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">

                    <input
                        type="text"
                        placeholder="Cari kode pesanan..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1766D3]"
                    />

                </div>
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Kelola Pesanan
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Pantau pesanan yang masuk dan telah selesai
                    </p>

                </div>

                {/* STATISTIK */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">

                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Package className="text-blue-600" />
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Pesanan Masuk
                            </p>

                            <h2 className="text-2xl font-bold">
                                {pesananMasuk.length}
                            </h2>
                        </div>

                    </div>

                </div>

                {/* 2 KOLOM */}
                <div className="space-y-5">

                    {pesananMasuk.length === 0 ? (

                        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
                            <Package size={50} className="mx-auto text-gray-300 mb-3" />

                            <h3 className="font-semibold text-lg text-gray-600">
                                Tidak ada pesanan masuk
                            </h3>

                            <p className="text-gray-400 text-sm">
                                Semua pesanan telah selesai diproses
                            </p>
                        </div>

                    ) : (

                        pesananMasuk.map((item) => (

                            <div
                                key={item.id}
                                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                            >

                                <div className="p-5">

                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                                        <div>

                                            <div className="flex items-center gap-3">

                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {item.kode}
                                                </h3>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === "Selesai"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>

                                            </div>

                                            <p className="text-gray-500 mt-1">
                                                {item.nama}
                                            </p>

                                        </div>

                                        <div className="text-left md:text-right">

                                            <p className="text-sm text-gray-500">
                                                {item.tanggal}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {item.metode}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                        <div>

                                            <p className="text-xs text-gray-400">
                                                Total Pembayaran
                                            </p>

                                            <h2 className="text-2xl font-bold text-[#1766D3]">
                                                Rp {item.total.toLocaleString("id-ID")}
                                            </h2>

                                        </div>

                                        <div className="flex gap-3">

                                            <button
                                                onClick={() => setSelectedOrder(item)}
                                                className="flex items-center justify-center gap-2 border border-[#1766D3] text-[#1766D3] px-5 py-2 rounded-xl hover:bg-blue-50 transition"
                                            >
                                                <Eye size={18} />
                                                Detail
                                            </button>

                                            {item.status !== "Selesai" && (
                                                <button
                                                    onClick={() => handleSelesai(item.id)}
                                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl"
                                                >
                                                    Selesaikan
                                                </button>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>

                {/* MODAL DETAIL */}
                {selectedOrder && (

                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                        <div className="bg-white rounded-2xl p-6 w-[400px]">

                            <h2 className="font-bold text-xl mb-4">
                                Detail Pesanan
                            </h2>

                            <div className="space-y-2">

                                <p>
                                    <b>Kode:</b> {selectedOrder.kode}
                                </p>

                                <p>
                                    <b>Pembeli:</b> {selectedOrder.nama}
                                </p>

                                <p>
                                    <b>Total:</b> Rp{" "}
                                    {selectedOrder.total.toLocaleString("id-ID")}
                                </p>

                                <p>
                                    <b>Metode:</b> {selectedOrder.metode}
                                </p>

                                <p>
                                    <b>Tanggal:</b> {selectedOrder.tanggal}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setSelectedOrder(null)
                                }
                                className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg"
                            >
                                Tutup
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </AppLayout>
    );
}