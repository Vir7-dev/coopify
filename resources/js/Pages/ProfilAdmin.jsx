import React from "react";
import AppLayout from "../Layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import {
    FaIdCard,
    FaPencilAlt,
    FaPhone,
    FaBox,
    FaLayerGroup,
    FaShoppingCart,
    FaCheckCircle,
    FaChevronRight,
    FaClipboardList,
    FaChartLine,
} from "react-icons/fa";


export default function ProfilAdmin() {
    const navigate = useNavigate();

    // DATA STATISTIK
    const stats = [
        { label: "Total Produk", value: 24, icon: <FaBox />, bg: "bg-green-100", text: "text-green-600" },
        { label: "Pesanan Masuk", value: 18, icon: <FaClipboardList />, bg: "bg-blue-100", text: "text-blue-600" },
        { label: "Total Kategori", value: 5, icon: <FaLayerGroup />, bg: "bg-yellow-100", text: "text-yellow-600" },
        { label: "Pesanan Selesai", value: 12, icon: <FaCheckCircle />, bg: "bg-pink-100", text: "text-pink-600" },
    ];

    // AKSES CEPAT
    const quickAccess = [
        {
            label: "Produk",
            sub: "Kelola Produk",
            icon: <FaBox />,
            bg: "bg-green-100",
            text: "text-green-600",
            path: "/kelola-produk",
        },
        {
            label: "Pesanan Masuk",
            sub: "Lihat & Konfirmasi Pesanan",
            icon: <FaClipboardList />,
            bg: "bg-blue-100",
            text: "text-blue-600",
            path: "/pesanan",
        },
        {
            label: "Kategori Produk",
            sub: "Kelola Kategori Produk",
            icon: <FaLayerGroup />,
            bg: "bg-yellow-100",
            text: "text-yellow-600",
            path: "/kelola-kategori",
        },
        {
            label: "Dashboard Penjualan",
            sub: "Lihat grafik & laporan",
            icon: <FaChartLine />,
            bg: "bg-pink-100",
            text: "text-pink-600",
            path: "/dashboard",
        },
    ];

    // INFO AKUN
    const infoAkun = [
        { label: "Role", value: "Administrator", valueClass: "text-blue-600 font-semibold" },
        { label: "Status Akun", value: "Aktif", valueClass: "text-green-600 font-semibold" },
        { label: "Login Terakhir", value: "29 Mar 2026, 08:45", valueClass: "text-gray-600" },
    ];

    return (
        <AppLayout role="admin">
            <div className="bg-gray-100 min-h-screen">

                {/* HEADER */}
                <div className="bg-[#3F7EA2] text-white p-6 mx-6 mt-6 rounded-t-lg relative">
                    <span className="absolute top-4 left-4 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FaCheckCircle size={9} /> Profil Saya
                    </span>
                    <div className="mt-4">
                        <h1 className="flex items-center gap-2 text-xl font-semibold">
                        Halo, Admin !  
                        </h1>
                        <p className="text-sm">Kelola informasi akun administrator koperasi kampus</p>
                    </div>
                </div>

                {/* PROFILE CARD */}
                <div className="bg-white mx-6 p-6 rounded shadow flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <div className="bg-[#3F7EA2] text-white w-16 h-16 flex items-center justify-center rounded text-lg font-bold">
                            AD
                        </div>

                        <div>
                            <h3 className="font-bold text-lg">Admin Koperasi</h3>

                            <div className="mt-2 space-y-2">
                                <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full w-fit">
                                    <FaIdCard /> NIP 198501012001
                                </span>

                                <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full w-fit">
                                    <FaPhone /> 081270130888
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1"
                        onClick={() => navigate("/edit-profil-admin")}
                    >
                        <FaPencilAlt size={10} className="mt-0.5" /> Edit Profil
                    </button>
                </div>

                {/* STATISTIK */}
                <div className="mx-6 grid grid-cols-4 gap-4 mt-6 mb-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 h-[80px]">
                            <div className={`${s.bg} ${s.text} p-3 rounded-xl text-lg`}>
                                {s.icon}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{s.value}</h2>
                                <p className="text-xs text-gray-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AKSES CEPAT */}
                <div className="mx-6 mb-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">AKSES CEPAT</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {quickAccess.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(item.path)}
                                className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`${item.bg} ${item.text} p-2.5 rounded-lg text-base`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{item.label}</p>
                                        <p className="text-xs text-gray-400">{item.sub}</p>
                                    </div>
                                </div>
                                <FaChevronRight className="text-gray-400 text-sm" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* INFORMASI AKUN */}
                <div className="mx-6 mb-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">INFORMASI AKUN</h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {infoAkun.map((info, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center px-5 py-3 border-b border-gray-100 last:border-0"
                            >
                                <p className="text-sm text-gray-500">{info.label}</p>
                                <p className={`text-sm ${info.valueClass}`}>{info.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}