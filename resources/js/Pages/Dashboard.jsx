import React from "react";
import AppLayout from "../Layouts/AppLayout";
import { Link } from "react-router-dom";
import {
    FaHamburger,
    FaCoffee,
    FaPencilAlt,
    FaPills,
    FaUserGraduate,
    FaShoppingCart,
    FaHeart,
} from "react-icons/fa";

function Dashboard() {
    const categories = [
        { title: "Makanan", icon: <FaHamburger /> },
        { title: "Minuman", icon: <FaCoffee /> },
        { title: "Alat Tulis", icon: <FaPencilAlt /> },
        { title: "Obat", icon: <FaPills /> },
        { title: "Almamater", icon: <FaUserGraduate /> },
    ];

    const bestSeller = [
        {
            id: 1,
            name: "Pocky",
            price: 5000,
            stok: 10,
            terjual: 120,
            gambar: "/img/pocky.jpg",
        },
        {
            id: 2,
            name: "Boncabe",
            price: 7000,
            stok: 5,
            terjual: 80,
            gambar: "/img/boncabe.jpg",
        },
        {
            id: 3,
            name: "Chitato",
            price: 8000,
            stok: 8,
            terjual: 60,
            gambar: "/img/chitato.jpg",
        },
        {
            id: 4,
            name: "Teh Botol",
            price: 5000,
            stok: 20,
            terjual: 200,
            gambar: "/img/teh_botol.jpg",
        },
        {
            id: 5,
            name: "Pocari",
            price: 8000,
            stok: 15,
            terjual: 150,
            gambar: "/img/pocari.jpg",
        },
        {
            id: 6,
            name: "Pocari",
            price: 8000,
            stok: 15,
            terjual: 150,
            gambar: "/img/pocari.jpg",
        },
    ];

    return (
        <AppLayout role="pengguna">
            <div className="bg-gray-100 min-h-screen pb-20 space-y-12">
                {/* HERO BACKGROUND SECTION */}

                <div
                    className="w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center"
                    style={{
                        backgroundImage: "url('/img/bg2.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >

                    <div className="w-full h-full flex items-center">
                        <div className="px-6 md:px-12 lg:px-16 text-white max-w-xl">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug">
                                <span className="text-yellow-300">
                                 Koperasi Digital
                                </span>{" "}
                                <br />
                                untuk Transaki Cepat dan Praktis

                            </h1>

                            <p className="text-xs md:text-sm opacity-90 mt-3 mb-5">
                               Tersedia makanan, minuman, alat tulis, obat, dn almamater.
                            </p>

                            <button className="bg-white text-[#1766D3] px-4 md:px-5 py-2 rounded-xl text-xs md:text-sm font-semibold hover:scale-95 transition">
                                Tentang Aplikasi
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-6 md:px-10 mt-10">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                        Kategori Produk
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                        {categories.map((cat, i) => {
                            const slug = cat.title
                                .toLowerCase()
                                .replace(" ", "-");

                            return (
                                <Link
                                    key={i}
                                    to={`/produk/${slug}`}
                                    className="group relative bg-white rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                >
                                    {/* BACKGROUND HOVER EFFECT */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1766D3]/10 to-[#1766D3]/0 opacity-0 group-hover:opacity-100 transition"></div>

                                    {/* ICON */}
                                    <div className="relative z-10 text-2xl text-[#1766D3] bg-blue-50 p-4 rounded-full group-hover:scale-110 transition">
                                        {cat.icon}
                                    </div>

                                    {/* TEXT */}
                                    <p className="relative z-10 mt-3 text-sm md:text-base font-medium text-gray-700 group-hover:text-[#1766D3] transition">
                                        {cat.title}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="px-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                            Produk Terlaris
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {bestSeller.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative bg-gray-50 rounded-xl h-36 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={item.gambar}
                                        alt={item.name}
                                        className="h-28 object-contain hover:scale-110 transition"
                                    />

                                    <FaHeart className="absolute top-2 left-2 text-gray-300 hover:text-red-500 cursor-pointer" />
                                </div>

                                <div className="mt-3">
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        {item.name}
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.terjual} terjual
                                    </p>

                                    <p className="text-base font-bold text-[#1297C9] mt-1">
                                        Rp {item.price.toLocaleString("id-ID")}
                                    </p>

                                    <p
                                        className={`text-xs font-semibold mt-2 ${
                                            item.stok === 0
                                                ? "text-gray-400"
                                                : item.stok < 5
                                                  ? "text-red-500"
                                                  : "text-green-600"
                                        }`}
                                    >
                                        {item.stok === 0
                                            ? "Stok: Habis"
                                            : `Stok: ${item.stok} tersedia`}
                                    </p>
                                </div>

                                <button
                                    disabled={item.stok === 0}
                                    className={`mt-4 w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition ${
                                        item.stok === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-[#1766D3] hover:bg-[#3D8FFF] active:scale-95 text-white"
                                    }`}
                                >
                                    <FaShoppingCart size={12} />
                                    {item.stok === 0 ? "Habis" : "Tambah"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
