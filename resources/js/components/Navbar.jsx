import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { useCart } from "../context/CartContext";

import {
    FaUserCircle,
    FaBell,
    FaShoppingCart,
    FaBars,
    FaTimes,
    FaCheckCircle,
    FaSearch,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import { Check } from "lucide-react";

function Navbar({ role }) {
    const navigate = useNavigate();
    const { cartCount } = useCart();

    const [openProfile, setOpenProfile] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [openMobileDropdown, setOpenMobileDropdown] = useState(false);

    const userString = localStorage.getItem("user");
    let user = null;
    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (e) {
        user = null;
    }

    const [openNotif, setOpenNotif] = useState(false);
    const [keyword, setKeyword] = useState("");

    const notifications = [
        {
            code: "ORD12345",
            time: "5 menit lalu",
            pickup: "22 Apr 2026 - 09:15",
        },
        {
            code: "ORD12346",
            time: "6 menit lalu",
            pickup: "22 Apr 2026 - 09:20",
        },
    ];

    // State untuk Pesanan Masuk (dari database)
    const [openOrders, setOpenOrders] = useState(false);
    const [openDetail, setOpenDetail] = useState(null);
    const [orderList, setOrderList] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Fetch pesanan menunggu saat mount
    useEffect(() => {
        if (role === "admin") {
            fetchPesananMenunggu();
        }
    }, [role]);

    const fetchPesananMenunggu = async () => {
        setLoadingOrders(true);
        try {
            const res = await api.get('/admin/pesanan?status=menunggu');
            setOrderList(res.data || []);
        } catch (err) {
            console.error('Error fetch pesanan:', err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const selesaiPesanan = async (id) => {
        try {
            await api.put(`/admin/pesanan/${id}/status`, { status: 'selesai' });
            // Refresh list
            fetchPesananMenunggu();
        } catch (err) {
            console.error('Error update status:', err);
            alert('Gagal menyelesaikan pesanan');
        }
    };

    const batalkanPesanan = async (id) => {
        if (!confirm('Yakin ingin membatalkan pesanan ini?')) return;

        try {
            await api.put(`/admin/pesanan/${id}/status`, { status: 'dibatalkan' });
            // Refresh list
            fetchPesananMenunggu();
        } catch (err) {
            console.error('Error batalkan pesanan:', err);
            alert('Gagal membatalkan pesanan');
        }
    };

    const profilePath = role === "admin" ? "/profil-admin" : "/profil-pengguna";

    const handleSearch = (e) => {
        if (e.key === "Enter" && keyword.trim()) {
            navigate(`/search?q=${encodeURIComponent(keyword)}`);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete axios.defaults.headers.common.Authorization;
            navigate("/login");
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Semua field harus diisi");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Konfirmasi password tidak cocok");
            return;
        }

        try {
            const response = await api.post("/ganti-password", {
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            alert(response.data.message);

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setOpenPasswordModal(false);
        } catch (error) {
            alert(error.response?.data?.message || "Gagal ubah password");
        }
    };

    const formatTanggal = (tanggal) => {
        if (!tanggal) return '-';
        const date = new Date(tanggal);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white text-[#1766D3] shadow-sm px-6 py-3 relative">
            <div className="flex items-center justify-between w-full md:w-auto">
                {/* LOGO */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <img src="/img/logo.png" className="w-10 h-10" alt="logo" />
                    <span className="text-xl font-bold">Coopify</span>
                </div>

                {/* HAMBURGER MENU */}
                <button
                    className="md:hidden"
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    {openMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>

                {/* MENU ADMIN */}
                {role === "admin" && (
                    <ul className="hidden md:flex gap-8">
                        <li
                            onClick={() => navigate("/dashboard-admin")}
                            className="cursor-pointer hover:text-blue-500"
                        >
                            Dashboard
                        </li>

                        <li
                            onClick={() => navigate("/kelola-produk")}
                            className="cursor-pointer hover:text-blue-500"
                        >
                            Produk
                        </li>

                        <li
                            onClick={() => navigate("/kelola-kategori")}
                            className="cursor-pointer hover:text-blue-500"
                        >
                            Kategori
                        </li>
                    </ul>
                )}

                {/* SEARCH BAR */}
                {role !== "admin" && (
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="relative w-full max-w-xl">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Cari produk..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1766D3]"
                            />
                        </div>
                    </div>
                )}

                {/* ICON + PROFILE */}
                <div className="hidden md:flex items-center gap-4 relative">
                    {role === "admin" ? (
                        <div className="relative">
                            <FaCheckCircle
                                className="cursor-pointer hover:text-blue-600 transition"
                                size={22}
                                onClick={() => {
                                    setOpenOrders(!openOrders);
                                    if (!openOrders) fetchPesananMenunggu();
                                }}
                            />

                            {orderList.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none">
                                    {orderList.length > 99 ? '99+' : orderList.length}
                                </span>
                            )}

                            <div
                                onMouseLeave={() => setOpenOrders(false)}
                                className={`absolute right-0 mt-3 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 transition-all duration-300 origin-top
                                ${openOrders ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-[#1766D3] to-[#3D8FFF] text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle size={18} />
                                        <span className="font-semibold">Pesanan Masuk</span>
                                    </div>
                                    {orderList.length > 0 && (
                                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                            {orderList.length} baru
                                        </span>
                                    )}
                                </div>

                                {/* List */}
                                <div className="max-h-[400px] overflow-y-auto">
                                    {loadingOrders ? (
                                        <div className="p-8 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1766D3] mx-auto"></div>
                                            <p className="mt-2 text-sm text-gray-500">Memuat pesanan...</p>
                                        </div>
                                    ) : orderList.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <div className="text-gray-300 mb-2">
                                                <FaCheckCircle size={40} className="mx-auto" />
                                            </div>
                                            <p className="text-sm text-gray-500">Tidak ada pesanan masuk</p>
                                        </div>
                                    ) : (
                                        orderList.map((order, index) => (
                                            <div key={order.id_pesanan} className="border-b border-gray-100 last:border-b-0">
                                                {/* Header */}
                                                <div
                                                    onClick={() =>
                                                        setOpenDetail(
                                                            openDetail === index
                                                                ? null
                                                                : index,
                                                        )
                                                    }
                                                    className="px-4 py-3 flex justify-between items-start cursor-pointer hover:bg-blue-50/50 transition"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-bold text-gray-800">
                                                                {order.kode_pesanan}
                                                            </p>
                                                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                                                                {order.status_pesanan}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-0.5">
                                                            {order.pengguna?.nama || 'Pengguna'}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400">
                                                            {formatTanggal(order.tgl_pesanan)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-[#1766D3]">
                                                            Rp {Number(order.total_harga || 0).toLocaleString('id-ID')}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                            {order.detail_pesanan?.length || 0} item
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Detail */}
                                                <div
                                                    className={`transition-all duration-300 overflow-hidden
                                                    ${openDetail === index ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
                                                >
                                                    <div className="px-4 pb-4 bg-gray-50/70">
                                                        {/* Items */}
                                                        <div className="bg-white rounded-lg p-3 mb-3">
                                                            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Item Pesanan</p>
                                                            <ul className="space-y-1.5">
                                                                {order.detail_pesanan?.map((item, i) => (
                                                                    <li key={i} className="flex justify-between text-xs">
                                                                        <span className="text-gray-700">
                                                                            {item.produk?.nama_produk || 'Produk'} <span className="text-gray-400">x{item.jml_peritem}</span>
                                                                        </span>
                                                                        <span className="text-gray-600 font-medium">
                                                                            Rp {Number(item.subtotal_dp || 0).toLocaleString('id-ID')}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => selesaiPesanan(order.id_pesanan)}
                                                                className="flex-1 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white text-xs font-medium px-3 py-2 rounded-lg transition flex items-center justify-center gap-1.5"
                                                            >
                                                                <Check size={14} />
                                                                Tandai Selesai
                                                            </button>
                                                            <button
                                                                onClick={() => batalkanPesanan(order.id_pesanan)}
                                                                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition"
                                                            >
                                                                Batalkan
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : user ? (
                        <>
                            <div className="relative">
                                <FaBell
                                    onClick={() => setOpenNotif(!openNotif)}
                                    className="cursor-pointer"
                                />

                                <div
                                    className={`absolute right-0 mt-3 w-[320px] bg-white rounded-xl shadow-xl transition
                                    ${openNotif ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                                    onMouseLeave={() => setOpenNotif(false)}
                                >
                                    <div className="bg-[#1766D3] text-white p-3 rounded-t-xl">
                                        Notifikasi
                                    </div>

                                    {notifications.map((n, i) => (
                                        <div
                                            key={i}
                                            className="p-3 border-b text-sm"
                                        >
                                            Pesanan <b>{n.code}</b> siap diambil
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div
                                className="relative cursor-pointer"
                                onClick={() => navigate("/keranjang")}
                                data-cart-icon
                            >
                                <FaShoppingCart className="cursor-pointer" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : null}

                    {/* PROFILE OR LOGIN */}
                    {user ? (
                        <div className="relative">
                            {user?.foto_profil ? (
                                <img
                                    src={user.foto_profil}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover cursor-pointer border border-gray-200"
                                    onClick={() => setOpenProfile(!openProfile)}
                                />
                            ) : (
                                <FaUserCircle
                                    className="text-2xl cursor-pointer"
                                    onClick={() => setOpenProfile(!openProfile)}
                                />
                            )}

                            {openProfile && (
                                <div
                                    className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-[999]"
                                    onMouseLeave={() => setOpenProfile(false)}
                                >
                                    <div className="bg-gradient-to-r from-[#1766D3] to-[#3D8FFF] p-4 flex items-center gap-3 text-white">
                                        <div className="w-10 h-10 rounded-full bg-white text-[#3F7EA2] overflow-hidden flex items-center justify-center font-bold">
                                            {user?.foto_profil ? (
                                                <img
                                                    src={user.foto_profil}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : user?.nama || user?.name ? (
                                                (user?.nama || user?.name)
                                                    .charAt(0)
                                                    .toUpperCase()
                                            ) : (
                                                <FaUserCircle size={28} />
                                            )}
                                        </div>

                                        <div>
                                            <p className="font-semibold text-sm">
                                                {user?.nama ||
                                                    user?.name ||
                                                    (role === "admin"
                                                        ? "Admin Kopi"
                                                        : "Pengguna")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="py-2 text-sm text-black">
                                        <div
                                            onClick={() =>
                                                navigate(profilePath)
                                            }
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Lihat Profil
                                        </div>

                                        <div
                                            onClick={() => {
                                                setOpenProfile(false);
                                                setOpenPasswordModal(true);
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Ubah Kata Sandi
                                        </div>

                                        <div
                                            onClick={handleLogout}
                                            className="px-4 py-2 text-red-500 cursor-pointer"
                                        >
                                            Keluar
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            onClick={() => navigate("/login")}
                            className="cursor-pointer font-bold text-white bg-[#1766D3] hover:bg-[#3D8FFF] px-4 py-2 rounded-lg shadow-sm transition active:scale-95"
                        >
                            Log in
                        </div>
                    )}
                </div>

                {/* MODAL */}
                {openPasswordModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                        <div className="bg-white rounded-xl shadow-xl w-[400px] p-6 relative">
                            <button
                                onClick={() => setOpenPasswordModal(false)}
                                className="absolute top-3 right-3 text-xl"
                            >
                                <FaTimes size={18} />
                            </button>

                            <h2 className="text-xl font-bold mb-4 text-[#1766D3]">
                                Ubah Kata Sandi
                            </h2>

                            <input
                                type="password"
                                placeholder="Password Lama"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full border p-2 rounded mb-3"
                            />

                            <input
                                type="password"
                                placeholder="Password Baru"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border p-2 rounded mb-3"
                            />

                            <input
                                type="password"
                                placeholder="Konfirmasi Password Baru"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="w-full border p-2 rounded mb-4"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setOpenPasswordModal(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                >
                                    Batal
                                </button>

                                <button
                                    onClick={handleChangePassword}
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {openMenu && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t md:hidden z-50">
                    <div className="flex flex-col">
                        {role === "admin" ? (
                            <>
                                <button
                                    onClick={() => {
                                        navigate("/dashboard-admin");
                                        setOpenMenu(false);
                                    }}
                                    className="px-6 py-3 text-left hover:bg-gray-100"
                                >
                                    Dashboard
                                </button>

                                <button
                                    onClick={() => {
                                        navigate("/kelola-produk");
                                        setOpenMenu(false);
                                    }}
                                    className="px-6 py-3 text-left hover:bg-gray-100"
                                >
                                    Produk
                                </button>

                                <button
                                    onClick={() => {
                                        navigate("/kelola-kategori");
                                        setOpenMenu(false);
                                    }}
                                    className="px-6 py-3 text-left hover:bg-gray-100"
                                >
                                    Kategori
                                </button>

                                <button
                                    onClick={() =>
                                        setOpenMobileDropdown(
                                            !openMobileDropdown,
                                        )
                                    }
                                    className="px-6 py-3 text-left hover:bg-gray-100 flex justify-between items-center"
                                >
                                    <span>
                                        Pesanan Masuk ({orderList.length})
                                    </span>
                                    <span>
                                        {openMobileDropdown ? (
                                            <FaChevronUp size={12} />
                                        ) : (
                                            <FaChevronDown size={12} />
                                        )}
                                    </span>
                                </button>

                                {openMobileDropdown && (
                                    <div className="bg-gray-50 border-b">
                                        {orderList.length === 0 ? (
                                            <div className="px-8 py-3 text-sm text-gray-500">
                                                Tidak ada pesanan
                                            </div>
                                        ) : (
                                            orderList.map((order) => (
                                                <div
                                                    key={order.id_pesanan}
                                                    className="px-8 py-3 text-sm border-b last:border-b-0"
                                                >
                                                    <p className="font-semibold">
                                                        {order.kode_pesanan}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {order.pengguna?.nama || 'Pengguna'}
                                                    </p>
                                                    <span className="text-xs text-yellow-600">
                                                        {order.status_pesanan}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        navigate(profilePath);
                                        setOpenMenu(false);
                                    }}
                                    className="px-6 py-3 text-left hover:bg-gray-100"
                                >
                                    Lihat Profil
                                </button>

                                <button
                                    onClick={() => {
                                        setOpenMenu(false);
                                        setOpenPasswordModal(true);
                                    }}
                                    className="px-6 py-3 text-left hover:bg-gray-100"
                                >
                                    Ubah Kata Sandi
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/")}
                                    className="px-6 py-3 text-left hover:bg-gray-100"
                                >
                                    Beranda
                                </button>

                                <button
                                    onClick={() => {
                                        navigate("/keranjang");
                                        setOpenMenu(false);
                                    }}
                                    className="px-6 py-3 text-left hover:bg-gray-100"
                                >
                                    Keranjang
                                </button>

                                <button
                                    onClick={() =>
                                        setOpenMobileDropdown(
                                            !openMobileDropdown,
                                        )
                                    }
                                    className="px-6 py-3 text-left hover:bg-gray-100 flex justify-between items-center"
                                >
                                    <span>Notifikasi</span>
                                    <span>
                                        {openMobileDropdown ? "▲" : "▼"}
                                    </span>
                                </button>

                                {openMobileDropdown && (
                                    <div className="bg-gray-50 border-b">
                                        {notifications.map((n, i) => (
                                            <div
                                                key={i}
                                                className="px-8 py-2 text-sm"
                                            >
                                                Pesanan <b>{n.code}</b> siap
                                                diambil
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        navigate(profilePath);
                                        setOpenMenu(false);
                                    }}
                                    className="px-6 py-3 text-left hover:bg-gray-100"
                                >
                                    Lihat Profil
                                </button>

                                <button
                                    onClick={() => {
                                        setOpenMenu(false);
                                        setOpenPasswordModal(true);
                                    }}
                                    className="px-6 py-3 text-left hover:bg-gray-100"
                                >
                                    Ubah Kata Sandi
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => {
                                setOpenMenu(false);
                                handleLogout();
                            }}
                            className="px-6 py-3 text-left text-red-500 hover:bg-red-50"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
