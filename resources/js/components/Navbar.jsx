import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { API_BASE_URL } from "../api";
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

    // State untuk search suggestion
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    // Debounced search suggestion
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (keyword.length >= 3) {
                fetchSuggestions(keyword);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [keyword]);

    const fetchSuggestions = async (query) => {
        setSearchLoading(true);
        setShowSuggestions(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/produk/search?q=${encodeURIComponent(query)}`);
            const results = (res.data?.data || []).slice(0, 5);
            setSuggestions(results);
        } catch (err) {
            console.error("Gagal fetch suggestions:", err);
            setSuggestions([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSuggestionClick = (product) => {
        navigate(`/detail-produk/${product.id_produk}`);
        setShowSuggestions(false);
        setKeyword("");
        setSuggestions([]);
    };

    const handleKeywordChange = (e) => {
        const value = e.target.value;
        setKeyword(value);
        if (value.length >= 3) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    const handleSearchFocus = () => {
        if (keyword.length >= 3 && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleSearchBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    // State untuk Notifikasi (dari database)
    const [notifications, setNotifications] = useState([]);
    const [loadingNotif, setLoadingNotif] = useState(false);

    // Fetch notifikasi dari database
    const fetchNotifikasi = async () => {
        if (!user) return;
        setLoadingNotif(true);
        try {
            const res = await api.get('/profil-pengguna/notifikasi');
            setNotifications(res.data.notifikasi || []);
        } catch (err) {
            console.error('Error fetch notifikasi:', err);
        } finally {
            setLoadingNotif(false);
        }
    };

    // Auto-fetch notifikasi saat user login (sekali saja)
    useEffect(() => {
        if (user) {
            fetchNotifikasi();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // State untuk Pesanan Masuk (dari database)
    const [openOrders, setOpenOrders] = useState(false);
    const [openDetail, setOpenDetail] = useState(null);
    const [orderList, setOrderList] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

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

    const prosesPesanan = async (id) => {
        try {
            await api.put("/admin/pesanan/" + id + "/status", { status: 'diproses' });
            fetchPesananMenunggu();
        } catch (err) {
            console.error('Error update status:', err);
            alert('Gagal memproses pesanan');
        }
    };

    const batalkanPesanan = async (id) => {
        if (!confirm('Yakin ingin membatalkan pesanan ini?')) return;
        try {
            await api.put("/admin/pesanan/" + id + "/status", { status: 'dibatalkan' });
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
            localStorage.removeItem("last_active");
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
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white text-[#1766D3] shadow-sm">
            {/* DESKTOP LAYOUT (hidden on mobile) */}
            <div className="hidden md:block">
                <div className="flex items-center justify-between px-6 py-3">
                    {/* LEFT: Logo + Admin Menu */}
                    <div className="flex items-center gap-6">
                        {/* LOGO */}
                        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
                            <img src="/img/logo.png" className="w-10 h-10" alt="logo" />
                            <span className="text-xl font-bold">Coopify</span>
                        </div>

                        {/* ADMIN: Navigation Menu (single row) */}
                        {role === "admin" && (
                            <div className="flex items-center gap-1 ml-4 border-l border-gray-200 pl-4">
                                {[
                                    { label: 'Dashboard', path: '/dashboard-admin' },
                                    { label: 'Produk', path: '/kelola-produk' },
                                    { label: 'Kategori', path: '/kelola-kategori' },
                                    { label: 'Pesanan', path: '/pesanan-masuk' },
                                ].map((item, index) => (
                                    <React.Fragment key={item.path}>
                                        {index > 0 && (
                                            <div className="h-4 w-px bg-gray-200 mx-1"></div>
                                        )}
                                        <span
                                            onClick={() => navigate(item.path)}
                                            className="cursor-pointer hover:text-blue-500 font-medium transition px-2 py-1"
                                        >
                                            {item.label}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CENTER: Search Bar (non-admin only) */}
                    {role !== "admin" && (
                        <div className="flex-1 max-w-2xl mx-8 relative">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={handleKeywordChange}
                                    onKeyDown={handleSearch}
                                    onFocus={handleSearchFocus}
                                    onBlur={handleSearchBlur}
                                    placeholder="Cari produk..."
                                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1766D3] bg-gray-50 hover:bg-white transition-colors"
                                />

                                {/* Suggestions Dropdown */}
                                {showSuggestions && keyword.length >= 3 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-[100] overflow-hidden">
                                        {searchLoading ? (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                <span className="inline-block animate-spin mr-1">⟳</span>
                                                Mencari...
                                            </div>
                                        ) : suggestions.length > 0 ? (
                                            suggestions.map((item) => (
                                                <div
                                                    key={item.id_produk}
                                                    onClick={() => handleSuggestionClick(item)}
                                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                                >
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {item.nama_produk}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                Tidak ada hasil untuk "{keyword}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* RIGHT: Icons */}
                    <div className="flex items-center gap-4">

                        {/* ADMIN: Pesanan Masuk */}
                        {role === "admin" ? (
                            <div className="relative">
                                <FaCheckCircle
                                    className="cursor-pointer hover:text-blue-600 transition"
                                    size={22}
                                    onClick={() => {
                                        setOpenOrders(!openOrders);
                                        setOpenProfile(false);
                                        if (!openOrders) fetchPesananMenunggu();
                                    }}
                                />
                                {orderList.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none">
                                        {orderList.length > 99 ? '99+' : orderList.length}
                                    </span>
                                )}

                                {/* Dropdown Pesanan */}
                                <div
                                    onMouseLeave={() => setOpenOrders(false)}
                                    className={`absolute right-0 mt-3 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 transition-all duration-300 origin-top
                                    ${openOrders ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                                >
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

                                    <div className="max-h-[400px] overflow-y-auto">
                                        {loadingOrders ? (
                                            <div className="p-8 text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1766D3] mx-auto"></div>
                                                <p className="mt-2 text-sm text-gray-500">Memuat pesanan...</p>
                                            </div>
                                        ) : orderList.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <FaCheckCircle size={40} className="mx-auto text-gray-300 mb-2" />
                                                <p className="text-sm text-gray-500">Tidak ada pesanan masuk</p>
                                            </div>
                                        ) : (
                                            orderList.map((order, index) => (
                                                <div key={order.id_pesanan} className="border-b border-gray-100 last:border-b-0">
                                                    <div
                                                        onClick={() => setOpenDetail(openDetail === index ? null : index)}
                                                        className="px-4 py-3 flex justify-between items-start cursor-pointer hover:bg-blue-50/50 transition"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-bold text-gray-800">{order.kode_pesanan}</p>
                                                                <span className="bg-yellow-100 text-yellow-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                                                                    {order.status_pesanan}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-0.5">{order.pengguna?.nama || 'Pengguna'}</p>
                                                            <p className="text-[11px] text-gray-400">{formatTanggal(order.tgl_pesanan)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-[#1766D3]">
                                                                Rp {Number(order.total_harga || 0).toLocaleString('id-ID')}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 mt-0.5">{order.detail_pesanan?.length || 0} item</p>
                                                        </div>
                                                    </div>

                                                    <div className={`transition-all duration-300 overflow-hidden ${openDetail === index ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                                                        <div className="px-4 pb-4 bg-gray-50/70">
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
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => prosesPesanan(order.id_pesanan)}
                                                                    className="flex-1 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-medium px-3 py-2 rounded-lg transition flex items-center justify-center gap-1.5"
                                                                >
                                                                    <Check size={14} /> Proses Pesanan
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
                                {/* Keranjang - Desktop */}
                                <div className="relative cursor-pointer" onClick={() => navigate("/keranjang")}>
                                    <FaShoppingCart className="cursor-pointer" data-cart-icon />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none">
                                            {cartCount > 99 ? "99+" : cartCount}
                                        </span>
                                    )}
                                </div>

                                {/* Notifikasi - Desktop */}
                                <div className="relative">
                                    <FaBell onClick={() => { setOpenNotif(!openNotif); setOpenProfile(false); }} className="cursor-pointer" />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                                            {notifications.length > 99 ? '99+' : notifications.length}
                                        </span>
                                    )}
                                    <div
                                        className={`absolute right-0 mt-3 w-[320px] bg-white rounded-xl shadow-xl transition
                                        ${openNotif ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                                        onMouseLeave={() => setOpenNotif(false)}
                                    >
                                        <div className="bg-[#1766D3] text-white p-3 rounded-t-xl flex items-center justify-between">
                                            <span>Notifikasi</span>
                                            {notifications.length > 0 && (
                                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                                    {notifications.length} baru
                                                </span>
                                            )}
                                        </div>
                                        {loadingNotif ? (
                                            <div className="p-6 text-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1766D3] mx-auto"></div>
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="p-6 text-center text-gray-500 text-sm">
                                                Tidak ada notifikasi
                                            </div>
                                        ) : (
                                            notifications.map((n, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition ${
                                                        n.status === 'siap diambil' ? 'bg-green-50/50' : ''
                                                    }`}
                                                    onClick={() => navigate(`/profil-pengguna`)}
                                                >
                                                    <p className="text-sm font-medium">
                                                        <span className={`font-bold ${n.status === 'siap diambil' ? 'text-green-600' : 'text-[#1766D3]'}`}>
                                                            {n.kode_pesanan}
                                                        </span>
                                                        {' - '}
                                                        {n.status === 'siap diambil' ? 'Siap diambil!' : 'Sedang diproses'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Waktu ambil: {n.wkt_pengambilan}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {n.total_item} item • Rp {Number(n.total_harga).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {/* Profile / Login - Desktop */}
                        {user ? (
                            <div className="relative">
                                {user?.foto_profil ? (
                                    <img
                                        src={user.foto_profil}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover cursor-pointer border border-gray-200"
                                        onClick={() => { setOpenProfile(!openProfile); setOpenOrders(false); }}
                                    />
                                ) : (
                                    <FaUserCircle className="text-2xl cursor-pointer" onClick={() => { setOpenProfile(!openProfile); setOpenOrders(false); }} />
                                )}

                                {openProfile && (
                                    <div
                                        className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-[999]"
                                        onMouseLeave={() => setOpenProfile(false)}
                                    >
                                        <div className="bg-gradient-to-r from-[#1766D3] to-[#3D8FFF] p-4 flex items-center gap-3 text-white">
                                            <div className="w-10 h-10 rounded-full bg-white text-[#3F7EA2] overflow-hidden flex items-center justify-center font-bold">
                                                {user?.foto_profil ? (
                                                    <img src={user.foto_profil} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    (user?.nama || user?.name || "").charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{user?.nama || user?.name || (role === "admin" ? "Admin Kopi" : "Pengguna")}</p>
                                            </div>
                                        </div>
                                        <div className="py-2 text-sm text-black">
                                            <div onClick={() => navigate(profilePath)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Lihat Profil</div>
                                            <div onClick={() => { setOpenProfile(false); setOpenPasswordModal(true); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Ubah Kata Sandi</div>
                                            <div onClick={handleLogout} className="px-4 py-2 text-red-500 cursor-pointer">Keluar</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div onClick={() => navigate("/login")} className="cursor-pointer font-bold text-white bg-[#1766D3] hover:bg-[#3D8FFF] px-4 py-2 rounded-lg shadow-sm transition active:scale-95">
                                Log in
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE LAYOUT (hidden on desktop) */}
            <div className="md:hidden">
                {/* Top row: Logo + Search + Icons + Hamburger */}
                <div className="flex items-center justify-between px-3 py-2 gap-2">
                    {/* LOGO */}
                    <div onClick={() => navigate("/")} className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                        <img src="/img/logo.png" className="w-7 h-7" alt="logo" />
                        <span className="text-base font-bold hidden sm:inline">Coopify</span>
                    </div>

                    {/* Search Bar - Mobile */}
                    <div className="relative flex-1 max-w-[220px] sm:max-w-[280px]">
                        <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                            onKeyDown={handleSearch}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            placeholder="Cari..."
                            className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1766D3]"
                        />

                        {/* Suggestions Dropdown - Mobile */}
                        {showSuggestions && keyword.length >= 3 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-xl z-[100] overflow-hidden">
                                {searchLoading ? (
                                    <div className="px-3 py-2 text-xs text-gray-500 text-center">
                                        <span className="inline-block animate-spin mr-1">⟳</span>
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    suggestions.map((item) => (
                                        <div
                                            key={item.id_produk}
                                            onClick={() => handleSuggestionClick(item)}
                                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                        >
                                            <p className="text-xs font-medium text-gray-800 truncate">
                                                {item.nama_produk}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-xs text-gray-500 text-center">
                                        Tidak ada hasil
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Icons - Mobile (Keranjang + Notifikasi) */}
                    {role !== "admin" && user && (
                        <div className="flex items-center gap-1.5">
                            {/* Keranjang */}
                            <div className="relative cursor-pointer p-1" onClick={() => navigate("/keranjang")}>
                                <FaShoppingCart className="w-5 h-5 cursor-pointer" data-cart-icon />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </div>

                            {/* Notifikasi */}
                            <div className="relative p-1">
                                <FaBell onClick={() => { setOpenNotif(!openNotif); setOpenProfile(false); }} className="w-5 h-5 cursor-pointer" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[14px] h-[14px] px-1 rounded-full flex items-center justify-center">
                                        {notifications.length > 99 ? '99+' : notifications.length}
                                    </span>
                                )}
                                <div
                                    className={`absolute right-0 mt-2 w-[280px] bg-white rounded-xl shadow-xl transition z-50
                                    ${openNotif ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                                    onMouseLeave={() => setOpenNotif(false)}
                                >
                                    <div className="bg-[#1766D3] text-white p-3 rounded-t-xl text-sm flex items-center justify-between">
                                        <span>Notifikasi</span>
                                        {notifications.length > 0 && (
                                            <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </div>
                                    {loadingNotif ? (
                                        <div className="p-4 text-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1766D3] mx-auto"></div>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-xs">
                                            Tidak ada notifikasi
                                        </div>
                                    ) : (
                                        notifications.map((n, i) => (
                                            <div
                                                key={i}
                                                className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${
                                                    n.status === 'siap diambil' ? 'bg-green-50/50' : ''
                                                }`}
                                                onClick={() => { navigate("/profil-pengguna"); setOpenNotif(false); }}
                                            >
                                                <p className="text-sm">
                                                    <span className={`font-bold ${n.status === 'siap diambil' ? 'text-green-600' : 'text-[#1766D3]'}`}>
                                                        {n.kode_pesanan}
                                                    </span>
                                                    {' - '}
                                                    {n.status === 'siap diambil' ? 'Siap diambil!' : 'Sedang diproses'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {n.wkt_pengambilan}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Button - Mobile (guest) */}
                    {!user && (
                        <div onClick={() => navigate("/login")} className="cursor-pointer font-bold text-white bg-[#1766D3] hover:bg-[#3D8FFF] px-3 py-1.5 rounded-lg text-xs shadow-sm transition active:scale-95">
                            Log in
                        </div>
                    )}

                    {/* Hamburger Menu */}
                    <button className="p-1" onClick={() => setOpenMenu(!openMenu)}>
                        {openMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {openMenu && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t md:hidden z-50">
                    <div className="flex flex-col">
                        {role === "admin" ? (
                            <>
                                <button onClick={() => { navigate("/dashboard-admin"); setOpenMenu(false); }} className="px-6 py-3 text-left hover:bg-gray-100">Dashboard</button>
                                <button onClick={() => { navigate("/kelola-produk"); setOpenMenu(false); }} className="px-6 py-3 text-left hover:bg-gray-100">Produk</button>
                                <button onClick={() => { navigate("/kelola-kategori"); setOpenMenu(false); }} className="px-6 py-3 text-left hover:bg-gray-100">Kategori</button>
                                <button onClick={() => { navigate("/pesanan-masuk"); setOpenMenu(false); }} className="px-6 py-3 text-left hover:bg-gray-100 font-semibold">Pesanan</button>
                                <button onClick={() => setOpenMobileDropdown(!openMobileDropdown)} className="px-6 py-3 text-left hover:bg-gray-100 flex justify-between items-center">
                                    <span>Pesanan Masuk ({orderList.length})</span>
                                    {openMobileDropdown ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                </button>
                                {openMobileDropdown && (
                                    <div className="bg-gray-50 border-b">
                                        {orderList.length === 0 ? (
                                            <div className="px-8 py-3 text-sm text-gray-500">Tidak ada pesanan</div>
                                        ) : (
                                            orderList.map((order) => (
                                                <div key={order.id_pesanan} className="px-8 py-3 text-sm border-b last:border-b-0">
                                                    <p className="font-semibold">{order.kode_pesanan}</p>
                                                    <p className="text-gray-600">{order.pengguna?.nama || 'Pengguna'}</p>
                                                    <span className="text-xs text-yellow-600">{order.status_pesanan}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                <button onClick={() => { navigate(profilePath); setOpenMenu(false); }} className="px-6 py-3 text-left hover:bg-gray-100">Lihat Profil</button>
                                <button onClick={() => { setOpenMenu(false); setOpenPasswordModal(true); }} className="px-6 py-3 text-left hover:bg-gray-100">Ubah Kata Sandi</button>
                                <button onClick={() => { setOpenMenu(false); handleLogout(); }} className="px-6 py-3 text-left text-red-500 hover:bg-red-50">Keluar</button>
                            </>
                        ) : user ? (
                            <>
                                <button onClick={() => navigate("/")} className="px-6 py-3 text-left hover:bg-gray-100">Beranda</button>
                                <button onClick={() => { navigate(profilePath); setOpenMenu(false); }} className="px-6 py-3 text-left hover:bg-gray-100">Lihat Profil</button>
                                <button onClick={() => { setOpenMenu(false); setOpenPasswordModal(true); }} className="px-6 py-3 text-left hover:bg-gray-100">Ubah Kata Sandi</button>
                                <button onClick={() => { setOpenMenu(false); handleLogout(); }} className="px-6 py-3 text-left text-red-500 hover:bg-red-50">Keluar</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate("/")} className="px-6 py-3 text-left hover:bg-gray-100">Beranda</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL CHANGE PASSWORD */}
            {openPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                    <div className="bg-white rounded-xl shadow-xl w-[400px] p-6 relative">
                        <button onClick={() => setOpenPasswordModal(false)} className="absolute top-3 right-3">
                            <FaTimes size={18} />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-[#1766D3]">Ubah Kata Sandi</h2>
                        <input type="password" placeholder="Password Lama" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full border p-2 rounded mb-3" />
                        <input type="password" placeholder="Password Baru" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border p-2 rounded mb-3" />
                        <input type="password" placeholder="Konfirmasi Password Baru" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border p-2 rounded mb-4" />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setOpenPasswordModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Batal</button>
                            <button onClick={handleChangePassword} className="px-4 py-2 bg-green-500 text-white rounded">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
