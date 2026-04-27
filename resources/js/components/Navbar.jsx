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
} from "react-icons/fa";

function Navbar({ role }) {
    const navigate = useNavigate();
    const [openProfile, setOpenProfile] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    // ✅ ROUTE DINAMIS BERDASARKAN ROLE
    const profilePath = role === "admin" ? "/profil-admin" : "/profil-pengguna";
    const passwordPath =
        role === "admin" ? "/ubah-password-admin" : "/ubah-password";

    return (
        <nav className="bg-[#3F7EA2] text-white shadow-md px-6 py-3">
            <div className="flex justify-between items-center">
                {/* LOGO */}
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <img src="/img/logo.png" className="w-10 h-10" />
                    <span className="text-xl font-bold">Coopify</span>
                </div>

                {/* HAMBURGER */}
                <div className="md:hidden">
                    {openMenu ? (
                        <FaTimes
                            size={22}
                            onClick={() => setOpenMenu(false)}
                            className="cursor-pointer"
                        />
                    ) : (
                        <FaBars
                            size={22}
                            onClick={() => setOpenMenu(true)}
                            className="cursor-pointer"
                        />
                    )}
                </div>

                {/* MENU DESKTOP */}
                <ul className="hidden md:flex gap-8">
                    {role === "admin" ? (
                        <>
                            <li
                                onClick={() => navigate("/dashboard-admin")}
                                className="cursor-pointer hover:text-green-200"
                            >
                                Dashboard
                            </li>
                            <li
                                onClick={() => navigate("/kelola-produk")}
                                className="cursor-pointer hover:text-green-200"
                            >
                                Produk
                            </li>
                            <li
                                onClick={() => navigate("/kelola-kategori")}
                                className="cursor-pointer hover:text-green-200"
                            >
                                Kategori
                            </li>
                        </>
                    ) : (
                        <>
                            <li
                                onClick={() => navigate("/")}
                                className="cursor-pointer hover:text-green-200"
                            >
                                Home
                            </li>
                            <li
                                onClick={() => navigate("/produk")}
                                className="cursor-pointer hover:text-green-200"
                            >
                                Produk
                            </li>
                            <li
                                onClick={() => navigate("/kontak")}
                                className="cursor-pointer hover:text-green-200"
                            >
                                Kontak
                            </li>
                        </>
                    )}
                </ul>

                {/* ICON DESKTOP */}
                <div className="hidden md:flex items-center gap-5 relative">
                    {role === "admin" ? (
                        <FaTachometerAlt
                            onClick={() => navigate("/dashboard-admin")}
                            className="cursor-pointer"
                        />
                    ) : (
                        <>
                            <FaBell className="cursor-pointer" />
                            <FaShoppingCart
                                onClick={() => navigate("/keranjang")}
                                className="cursor-pointer"
                            />
                        </>
                    )}

                    {/* PROFILE */}
                    <div className="relative">
                        <FaUserCircle
                            className="text-2xl cursor-pointer"
                            onClick={() => setOpenProfile(!openProfile)}
                        />

                        {openProfile && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                                <div className="bg-gradient-to-r from-[#3F7EA2] to-[#54A2CF] p-4 flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-white text-[#3F7EA2] flex items-center justify-center font-bold">
                                        {role === "admin" ? "A" : "U"}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-sm">
                                            {role === "admin"
                                                ? "Admin Koperasi"
                                                : "Pengguna"}
                                        </p>

                                        <p className="text-xs opacity-80">
                                            {role === "admin"
                                                ? "Akses penuh sistem"
                                                : "Akun pengguna"}
                                        </p>
                                    </div>
                                </div>

                                <div className="py-2 text-sm text-black">
                                    <div
                                        onClick={() => navigate(profilePath)}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <FaUser className="text-[#3F7EA2]" />
                                        Lihat Profil
                                    </div>

                                    <div
                                        onClick={() => navigate(passwordPath)}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <FaLock className="text-[#3F7EA2]" />
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
                                onClick={() => navigate("/produk")}
                                className="cursor-pointer"
                            >
                                Produk
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
        </nav>
    );
}

export default Navbar;
