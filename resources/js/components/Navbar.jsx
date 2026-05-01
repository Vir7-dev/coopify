import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUserCircle,
    FaBell,
    FaShoppingCart,
    FaTachometerAlt,
    FaBars,
    FaTimes,
    FaUser,
    FaLock,
    FaSignOutAlt,
    FaCheckCircle
} from "react-icons/fa";

function Navbar({ role }) {
    const navigate = useNavigate();

    const [openProfile, setOpenProfile] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    // 🔥 NOTIF USER
    const [openNotif, setOpenNotif] = useState(false);

    const notifications = [
        { code: "ORD12345", time: "5 menit lalu", pickup: "22 Apr 2026 - 09:15" },
        { code: "ORD12346", time: "6 menit lalu", pickup: "22 Apr 2026 - 09:20" },
    ];

    // 🔥 NOTIF ADMIN
    const [openOrders, setOpenOrders] = useState(false);
    const [openDetail, setOpenDetail] = useState(null);

    const orders = [
        {
            code: "ORD12345",
            user: "Falazri",
            pickup: "22 Apr 2026 - 09:15",
            items: ["Nasi Goreng", "Es Teh"],
            status: "Menunggu"
        },
        {
            code: "ORD12346",
            user: "Budi",
            pickup: "22 Apr 2026 - 09:30",
            items: ["Indomie", "Kopi"],
            status: "Menunggu"
        }
    ];

    const [orderList, setOrderList] = useState(orders);

    const selesaiPesanan = (code) => {
        const update = orderList.map((o) =>
            o.code === code ? { ...o, status: "Selesai" } : o
        );
        setOrderList(update);
    };

    const profilePath = role === "admin" ? "/profil-admin" : "/profil-pengguna";

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white text-[#1766D3] shadow-sm px-6 py-3">
            <div className="flex justify-between items-center">

                {/* LOGO */}
                <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
                    <img src="/img/logo.png" className="w-10 h-10" />
                    <span className="text-xl font-bold">Coopify</span>
                </div>

                {/* MOBILE MENU */}
                <div className="md:hidden">
                    {openMenu ? (
                        <FaTimes size={22} onClick={() => setOpenMenu(false)} />
                    ) : (
                        <FaBars size={22} onClick={() => setOpenMenu(true)} />
                    )}
                </div>

                {/* MENU */}
                <ul className="hidden md:flex gap-8">
                    {role === "admin" ? (
                        <>
                            <li onClick={() => navigate("/dashboard-admin")} className="cursor-pointer">Dashboard</li>
                            <li onClick={() => navigate("/kelola-produk")} className="cursor-pointer">Produk</li>
                            <li onClick={() => navigate("/kelola-kategori")} className="cursor-pointer">Kategori</li>
                        </>
                    ) : (
                        <>
                            <li onClick={() => navigate("/")} className="cursor-pointer">Home</li>
                            <li onClick={() => navigate("/kontak")} className="cursor-pointer">Kontak</li>
                        </>
                    )}
                </ul>

                {/* ICON */}
                <div className="hidden md:flex items-center gap-5 relative">

                    {/* ADMIN */}
                    {role === "admin" ? (
                        <div className="relative">
                            <FaCheckCircle
                                className="cursor-pointer"
                                onClick={() => setOpenOrders(!openOrders)}
                            />

                            {orderList.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                    {orderList.length}
                                </span>
                            )}

                            {/* DROPDOWN ADMIN */}
                            <div className={`absolute right-0 mt-3 w-[340px] bg-white rounded-2xl shadow-xl border z-50 transition-all duration-300 origin-top
                                ${openOrders ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>

                                <div className="bg-[#1766D3] text-white px-4 py-3 rounded-t-2xl">
                                    Pesanan Masuk
                                </div>

                                <div className="max-h-[320px] overflow-y-auto">
                                    {orderList.map((order, index) => (
                                        <div key={index} className="border-b">

                                            {/* HEADER */}
                                            <div
                                                onClick={() => setOpenDetail(openDetail === index ? null : index)}
                                                className="px-4 py-3 flex justify-between cursor-pointer hover:bg-gray-50"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold">{order.code}</p>
                                                    <p className="text-xs text-gray-500">{order.user}</p>
                                                </div>

                                                <span className="text-xs text-orange-500">
                                                    {order.status}
                                                </span>
                                            </div>

                                            {/* DETAIL (SMOOTH FIX) */}
                                            <div
                                                className={`transition-all duration-300 overflow-hidden
                                                ${openDetail === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                                            >
                                                <div className="px-4 pb-3 bg-gray-50">
                                                    <p className="text-xs mb-1">{order.pickup}</p>

                                                    <ul className="list-disc ml-4 text-sm mb-2">
                                                        {order.items.map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>

                                                    {order.status !== "Selesai" && (
                                                        <button
                                                            onClick={() => selesaiPesanan(order.code)}
                                                            className="bg-green-500 text-white text-xs px-3 py-1 rounded"
                                                        >
                                                            Tandai Selesai
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* USER NOTIF */}
                            <div className="relative">
                                <FaBell onClick={() => setOpenNotif(!openNotif)} className="cursor-pointer" />

                                <div className={`absolute right-0 mt-3 w-[320px] bg-white rounded-xl shadow-xl transition
                                    ${openNotif ? "opacity-100" : "opacity-0 pointer-events-none"}`}>

                                    <div className="bg-[#1766D3] text-white p-3 rounded-t-xl">
                                        Notifikasi
                                    </div>

                                    {notifications.map((n, i) => (
                                        <div key={i} className="p-3 border-b text-sm">
                                            Pesanan <b>{n.code}</b> siap diambil
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <FaShoppingCart onClick={() => navigate("/keranjang")} />
                        </>
                    )}

                    {/* PROFILE (TIDAK DIUBAH) */}
                    <div className="relative" onClick={() => setOpenProfile(true)}>
                        <FaUserCircle className="text-2xl cursor-pointer" />

                        {openProfile && (
                            <div onMouseLeave={() => setOpenProfile(false)} className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                                <div className="bg-gradient-to-r from-[#1766D3] to-[#3D8FFF] p-4 flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-white text-[#3F7EA2] flex items-center justify-center font-bold">
                                        {role === "admin" ? "A" : "U"}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-sm">
                                            {role === "admin" ? "Admin Koperasi" : "Pengguna"}
                                        </p>
                                        <p className="text-xs opacity-80">
                                            {role === "admin" ? "Akses penuh sistem" : "Akun pengguna"}
                                        </p>
                                    </div>
                                </div>

                                <div className="py-2 text-sm text-black">
                                    <div onClick={() => navigate(profilePath)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        Lihat Profil
                                    </div>

                                    <div onClick={() => setOpenPasswordModal(true)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        Ubah Kata Sandi
                                    </div>

                                    <div onClick={() => navigate("/login")} className="px-4 py-2 text-red-500 cursor-pointer">
                                        Keluar
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;