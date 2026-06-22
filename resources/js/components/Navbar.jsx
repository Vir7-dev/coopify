import React, { useState } from "react";
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

    const [openOrders, setOpenOrders] = useState(false);
    const [openDetail, setOpenDetail] = useState(null);

    const orders = [
        {
            code: "ORD12345",
            user: "Falazri",
            pickup: "22 Apr 2026 - 09:15",
            items: ["Nasi Goreng", "Es Teh"],
            status: "Menunggu",
        },
        {
            code: "ORD12346",
            user: "Budi",
            pickup: "22 Apr 2026 - 09:30",
            items: ["Indomie", "Kopi"],
            status: "Menunggu",
        },
    ];

    const [orderList, setOrderList] = useState(orders);

    const selesaiPesanan = (code) => {
        const update = orderList.map((o) =>
            o.code === code ? { ...o, status: "Selesai" } : o,
        );
        setOrderList(update);
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

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white text-[#1766D3] shadow-sm px-6 py-3">
            <div className="flex items-center w-full">
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
                    <div className="flex-1 flex justify-center">
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
                    </div>
                )}
                {/* SEARCH BAR */}
                {role !== "admin" && (
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="relative w-full max-w-xl">

                            <FaSearch
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

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
                <div className="hidden md:flex items-center gap-4 relative ml-auto">

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
                                className="cursor-pointer"
                                size={22}
                                onClick={() => setOpenOrders(!openOrders)}
                            />

                            {orderList.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                    {orderList.length}
                                </span>
                            )}

                            <div
                                onMouseLeave={() => setOpenOrders(false)}
                                className={`absolute right-0 mt-3 w-[340px] bg-white rounded-2xl shadow-xl border z-50 transition-all duration-300 origin-top
                                ${openOrders ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                            >
                                <div className="bg-[#1766D3] text-white px-4 py-3 rounded-t-2xl">
                                    Pesanan Masuk
                                </div>

                                <div className="max-h-[320px] overflow-y-auto">
                                    {orderList.map((order, index) => (
                                        <div key={index} className="border-b">
                                            <div
                                                onClick={() =>
                                                    setOpenDetail(
                                                        openDetail === index
                                                            ? null
                                                            : index,
                                                    )
                                                }
                                                className="px-4 py-3 flex justify-between cursor-pointer hover:bg-gray-50"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold">
                                                        {order.code}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {order.user}
                                                    </p>
                                                </div>

                                                <span className="text-xs text-orange-500">
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div
                                                className={`transition-all duration-300 overflow-hidden
                                                ${openDetail === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                                            >
                                                <div className="px-4 pb-3 bg-gray-50">
                                                    <p className="text-xs mb-1">
                                                        {order.pickup}
                                                    </p>

                                                    <ul className="list-disc ml-4 text-sm mb-2">
                                                        {order.items.map(
                                                            (item, i) => (
                                                                <li key={i}>
                                                                    {item}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>

                                                    {order.status !==
                                                        "Selesai" && (
                                                        <button
                                                            onClick={() =>
                                                                selesaiPesanan(
                                                                    order.code,
                                                                )
                                                            }
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
                                                        ? "Admin Koperasi"
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
                                        {orderList.map((order, index) => (
                                            <div
                                                key={index}
                                                className="px-8 py-2 text-sm"
                                            >
                                                <p className="font-semibold">
                                                    {order.code}
                                                </p>
                                                <p>{order.user}</p>
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
