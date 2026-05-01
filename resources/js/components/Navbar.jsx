import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUserCircle,
    FaBell,
    FaShoppingCart,
    FaUser,
    FaLock,
    FaSignOutAlt,
    FaCheckCircle
} from "react-icons/fa";

function Navbar({ role }) {
    const navigate = useNavigate();

    const [openProfile, setOpenProfile] = useState(false);

    // ================= USER NOTIF =================
    const [openNotif, setOpenNotif] = useState(false);

    const notifications = [
        { code: "ORD12345", time: "5 menit lalu", pickup: "22 Apr 2026 - 09:15" },
        { code: "ORD12346", time: "6 menit lalu", pickup: "22 Apr 2026 - 09:20" },
    ];

    // ================= ADMIN PESANAN =================
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
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <img src="/img/logo.png" className="w-10 h-10" />
                    <span className="text-xl font-bold">Coopify</span>
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

                    {/* ================= ADMIN ================= */}
                    {role === "admin" ? (
                        <div className="relative">

                            <FaCheckCircle
                                className="cursor-pointer hover:scale-110 hover:text-[#0F4DB8] transition"
                                onClick={() => setOpenOrders(!openOrders)}
                            />

                            {/* BADGE */}
                            {orderList.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                    {orderList.length}
                                </span>
                            )}

                            {/* DROPDOWN ADMIN */}
                            <div
                                className={`absolute right-0 mt-3 w-[340px] bg-white text-black rounded-2xl shadow-xl border z-50
                                transform transition-all duration-300 origin-top
                                ${openOrders ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                            >
                                <div className="bg-[#1766D3] text-white px-4 py-3 font-semibold rounded-t-2xl">
                                    Pesanan Masuk
                                </div>

                                {orderList.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 text-sm">
                                        Tidak ada pesanan
                                    </div>
                                ) : (

                                    orderList.map((order, index) => (
                                        <div key={index} className="p-3 border-b border-gray-100">

                                            {/* HEADER */}
                                            <div
                                                className="p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                                                onClick={() =>
                                                    setOpenDetail(openDetail === index ? null : index)
                                                }
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold">{order.code}</p>
                                                    <p className="text-xs text-gray-500">{order.user}</p>
                                                </div>

                                                <span className="text-xs text-orange-500">
                                                    {order.status}
                                                </span>
                                            </div>

                                            {/* DETAIL */}
                                            <div
                                                className={`overflow-hidden transition-all duration-300
                                                ${openDetail === index ? "max-h-40 p-3 bg-gray-50" : "max-h-0"}`}
                                            >
                                                <p className="text-xs mb-1">
                                                    Pengambilan: {order.pickup}
                                                </p>

                                                <ul className="list-disc ml-4 text-sm mb-2">
                                                    {order.items.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>

                                                {order.status !== "Selesai" && (
                                                    <button
                                                        onClick={() => selesaiPesanan(order.code)}
                                                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition"
                                                    >
                                                        Tandai Selesai
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                    ))

                                )}
                            </div>
                        </div>
                    ) : (

                        /* ================= USER ================= */

                        <>
                            <div className="relative">

                                <FaBell
                                    className="cursor-pointer hover:scale-110 hover:text-[#0F4DB8] transition"
                                    onClick={() => setOpenNotif(!openNotif)}
                                />

                                {/* BADGE */}
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                        {notifications.length}
                                    </span>
                                )}

                                {/* DROPDOWN NOTIF */}
                                <div
                                    className={`absolute right-0 mt-3 w-[340px] bg-white text-black rounded-2xl shadow-xl border z-50
                                    transform transition-all duration-300 origin-top
                                    ${openNotif ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                                >

                                    {/* HEADER */}
                                    <div className="flex justify-between items-center px-4 py-3 bg-[#1766D3] text-white rounded-t-2xl">
                                        <span className="font-semibold text-sm">Notifikasi</span>
                                        <button className="text-xs hover:underline opacity-80">
                                            Tandai dibaca
                                        </button>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="max-h-[320px] overflow-y-auto">

                                        {notifications.length === 0 ? (
                                            <div className="text-center py-10 text-gray-400 text-sm">
                                                🔕 Tidak ada notifikasi
                                            </div>
                                        ) : (

                                            notifications.map((notif, index) => (
                                                <div
                                                    key={index}
                                                    className="px-4 py-3 border-b hover:bg-gray-50 hover:shadow-sm transition cursor-pointer"
                                                >

                                                    <div className="flex items-start gap-3">

                                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-sm">
                                                            ✓
                                                        </div>

                                                        <div className="flex-1">
                                                            <p className="text-sm">
                                                                Pesanan <span className="font-semibold text-[#1766D3]">{notif.code}</span> siap diambil
                                                            </p>

                                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                                <span>{notif.pickup}</span>
                                                                <span>{notif.time}</span>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            ))

                                        )}

                                    </div>

                                </div>
                            </div>

                            <FaShoppingCart
                                onClick={() => navigate("/keranjang")}
                                className="cursor-pointer hover:scale-110 transition"
                            />
                        </>
                    )}

                    {/* PROFILE */}
                    <div
                        className="relative"
                        onClick={() => setOpenProfile(!openProfile)}
                    >
                        <FaUserCircle className="text-2xl cursor-pointer" />

                        {openProfile && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50">

                                <div className="bg-gradient-to-r from-[#1766D3] to-[#3D8FFF] p-4 flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-white text-[#1766D3] flex items-center justify-center font-bold">
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
                                    <div
                                        onClick={() => navigate(profilePath)}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <FaUser className="text-[#1766D3]" />
                                        Lihat Profil
                                    </div>

                                    <div
                                        onClick={() => setOpenPasswordModal(true)}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <FaLock className="text-[#1766D3]" />
                                        Ubah Kata Sandi
                                    </div>

                                    <div
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            navigate("/login");
                                        }}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer"
                                    >
                                        <FaSignOutAlt />
                                        Keluar
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                </div>
            </div>

            {openMenu && (
                <div className="md:hidden mt-4 bg-[#356c8c] rounded-lg p-4 space-y-3">
                    {role === "admin" ? (
                        <>
                            <div
                                onClick={() => navigate("/dashboard-admin")}
                                className="cursor-pointer"
                            >
                                Dashboard
                            </div>
                            <div
                                onClick={() => navigate("/kelola-produk")}
                                className="cursor-pointer"
                            >
                                Produk
                            </div>
                            <div
                                onClick={() => navigate("/kelola-kategori")}
                                className="cursor-pointer"
                            >
                                Kategori
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                onClick={() => navigate("/")}
                                className="cursor-pointer"
                            >
                                Home
                            </div>
                            <div
                                onClick={() => navigate("/kontak")}
                                className="cursor-pointer"
                            >
                                Kontak
                            </div>
                        </>
                    )}

                    <hr />

                    <div
                        onClick={() => navigate(profilePath)}
                        className="cursor-pointer"
                    >
                        Profile
                    </div>
                    <div
                        onClick={() => navigate(passwordPath)}
                        className="cursor-pointer"
                    >
                        Ubah Password
                    </div>

                    <div
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}
                        className="text-red-300 cursor-pointer"
                    >
                        Logout
                    </div>
                </div>
            )}

            {openPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="absolute inset-0 bg-black opacity-40"
                        onClick={() => setOpenPasswordModal(false)}
                    ></div>

                    {openPasswordModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div
                                className="absolute inset-0 bg-black/30"
                                onClick={() => setOpenPasswordModal(false)}
                            ></div>

                            <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden z-50">
                                <div className="bg-[#1766D3] px-5 py-3 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-white font-semibold">
                                        Ganti Password Akun
                                    </div>
                                    <button
                                        onClick={() =>
                                            setOpenPasswordModal(false)
                                        }
                                        className="text-white text-xl"
                                    >
                                    </button>
                                </div>

                                {/* BODY */}
                                <div className="p-5 text-sm text-gray-700">
                                    <p className="mb-4">
                                        Untuk mengganti password, harap
                                        menggunakan minimal 8 karakter yang unik
                                        dan tidak terkait dengan informasi anda.
                                    </p>

                                    {/* INPUT */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="font-semibold text-black">
                                                Kata Sandi Lama
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="Masukkan Kata Sandi Lama Anda..."
                                                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1  placeholder:text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="font-semibold text-black">
                                                Kata Sandi Baru
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="Masukkan Kata Sandi Baru Anda..."
                                                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 placeholder:text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="font-semibold text-black">
                                                Konfirmasi Kata Sandi Baru
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="Masukkan Kata Sandi Baru Anda..."
                                                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 placeholder:text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* BUTTON */}
                                    <div className="flex justify-end gap-3 mt-5">
                                        <button
                                            onClick={() =>
                                                setOpenPasswordModal(false)
                                            }
                                            className="px-4 py-2 bg-red-500 text-white rounded"
                                        >
                                            Batal
                                        </button>

                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded"
                                            onClick={() => {
                                                alert(
                                                    "Password berhasil diubah",
                                                );
                                                setOpenPasswordModal(false);
                                            }}
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;