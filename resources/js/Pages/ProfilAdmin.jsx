import React, { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

    // ---- STATE ----
    const [profil, setProfil]       = useState(null);
    const [statistik, setStatistik] = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);

    // ---- FETCH DATA DARI API ----
    useEffect(() => {
    const token = localStorage.getItem('token'); // ← ambil token dari localStorage

    axios.get('/api/admin/profil', {
        headers: {
            Authorization: `Bearer ${token}`  // ← kirim token
        }
    })
    .then(res => {
        setProfil(res.data.profil);
        setStatistik(res.data.statistik);
    })
    .catch(err => {
        console.error(err);
        setError('Gagal memuat data profil');
    })
    .finally(() => setLoading(false));
}, []);

    // ---- DATA STATISTIK (dari API) ----
    const stats = statistik ? [
        { label: "Total Produk",    value: statistik.total_produk,    icon: <FaBox />,           bg: "bg-green-100",  text: "text-green-600",  gradient: "from-green-500/10",  hover: "group-hover:text-green-600"  },
        { label: "Pesanan Masuk",   value: statistik.pesanan_masuk,   icon: <FaClipboardList />, bg: "bg-blue-100",   text: "text-blue-600",   gradient: "from-blue-500/10",   hover: "group-hover:text-blue-600"   },
        { label: "Total Kategori",  value: statistik.total_kategori,  icon: <FaLayerGroup />,    bg: "bg-yellow-100", text: "text-yellow-600", gradient: "from-yellow-500/10", hover: "group-hover:text-yellow-600" },
        { label: "Pesanan Selesai", value: statistik.pesanan_selesai, icon: <FaCheckCircle />,   bg: "bg-pink-100",   text: "text-pink-600",   gradient: "from-pink-500/10",   hover: "group-hover:text-pink-600"   },
    ] : [];

    // ---- AKSES CEPAT ----
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
            path: "/profil-admin",
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
            path: "/dashboard-admin",
        },
    ];

    // ---- INFO AKUN (dari API) ----
    const infoAkun = profil ? [
        { label: "Role",           value: profil.role,           valueClass: "text-blue-600 font-semibold"  },
        { label: "Status Akun",    value: profil.status,         valueClass: "text-green-600 font-semibold" },
        { label: "Login Terakhir", value: profil.login_terakhir, valueClass: "text-gray-600"                },
    ] : [];

    // ---- INISIAL AVATAR ----
    const inisial = profil?.nama
        ? profil.nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : 'AD';

    // ---- LOADING STATE ----
    if (loading) {
        return (
            <AppLayout role="admin" showFooter={false}>
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-gray-500 text-sm">Memuat data...</p>
                </div>
            </AppLayout>
        );
    }

    // ---- ERROR STATE ----
    if (error) {
        return (
            <AppLayout role="admin" showFooter={false}>
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout role="admin" showFooter={false}>
            <div className="bg-gray-100 min-h-screen">

                {/* HEADER */}
                <div className="bg-[#3F7EA2] text-white p-6 mx-6 mt-6 rounded-t-lg relative">
                    <div className="mt-4">
                        <h1 className="flex items-center gap-2 text-xl font-semibold">
                            Halo, {profil?.nama ?? 'Admin'} !
                        </h1>
                        <p className="text-sm">Kelola informasi akun administrator koperasi kampus</p>
                    </div>
                </div>

                {/* PROFILE CARD */}
                <div className="bg-white mx-6 p-6 rounded shadow flex justify-between items-center">
                    <div className="flex gap-4 items-center">

                        {/* Avatar: foto atau inisial */}
                        {profil?.foto_profil ? (
                            <img
                                src={profil.foto_profil}
                                alt="Foto Profil"
                                className="w-16 h-16 rounded object-cover"
                            />
                        ) : (
                            <div className="bg-[#3F7EA2] text-white w-16 h-16 flex items-center justify-center rounded text-lg font-bold">
                                {inisial}
                            </div>
                        )}

                        <div>
                            <h3 className="font-bold text-lg">{profil?.nama}</h3>

                            <div className="mt-2 space-y-2">
                                <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full w-fit">
                                    <FaIdCard /> {profil?.nim_nik}
                                </span>

                                <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full w-fit">
                                    <FaPhone /> {profil?.no_hp ?? '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        className="bg-[#3F7EA2] hover:bg-[#54A2CF] text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1"
                        onClick={() => navigate("/edit-profil-admin")}
                    >
                        <FaPencilAlt size={10} className="mt-0.5" /> Edit Profil
                    </button>
                </div>

                {/* STATISTIK */}
                <div className="mx-6 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-6">
                    {stats.map((s, i) => (
                        <div key={i} className="group relative bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 h-[80px] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                            <div className={`absolute inset-0 bg-gradient-to-tr ${s.gradient} to-transparent opacity-0 group-hover:opacity-100 transition duration-300`}></div>
                            <div className={`relative z-10 ${s.bg} ${s.text} p-3 rounded-xl text-lg group-hover:scale-110 transition duration-300`}>
                                {s.icon}
                            </div>
                            <div className="relative z-10 min-w-0">
                                <h2 className={`text-xl font-bold transition ${s.hover}`}>{s.value}</h2>
                                <p className="text-xs text-gray-500 truncate">{s.label}</p>
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
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{item.label}</p>
                                        <p className="text-xs text-gray-400 truncate">{item.sub}</p>
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