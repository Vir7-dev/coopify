import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { FaShoppingCart, FaSearch, FaHeart, FaStar, FaClock, FaSortAmountDown } from "react-icons/fa";

export default function Produk() {
    const [search, setSearch] = useState("");

    const products = [
        { id: 1, nama: "Cheezy Oat Choco", harga: 12000, stok: 3, terjual: 120, gambar: "img/makanan1.jpg" },
        { id: 2, nama: "Lays Classic", harga: 12000, stok: 5, terjual: 80, gambar: "img/makanan1.jpg" },
        { id: 3, nama: "Keripik Orion", harga: 12000, stok: 4, terjual: 45, gambar: "img/makanan1.jpg" },
        { id: 4, nama: "Bots Snack", harga: 12000, stok: 25, terjual: 300, gambar: "img/makanan1.jpg" },
        { id: 5, nama: "Taro Net", harga: 12000, stok: 15, terjual: 210, gambar: "img/makanan1.jpg" },
        { id: 6, nama: "Cheezy Oat Choco", harga: 12000, stok: 3, terjual: 95, gambar: "img/makanan1.jpg" },
        { id: 7, nama: "Lays Classic", harga: 12000, stok: 5, terjual: 60, gambar: "img/makanan1.jpg" },
        { id: 8, nama: "Keripik Orion", harga: 12000, stok: 4, terjual: 40, gambar: "img/makanan1.jpg" },
        { id: 9, nama: "Bots Snack", harga: 12000, stok: 25, terjual: 500, gambar: "img/makanan1.jpg" },
        { id: 10, nama: "Taro Net", harga: 12000, stok: 15, terjual: 275, gambar: "img/makanan1.jpg" },
    ];

    const filtered = products.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout role="pengguna">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Makanan 🍜
                    </h2>
                    <p className="text-sm text-gray-500">
                        Temukan makanan favoritmu
                    </p>
                </div>

                {/* SEARCH */}
                <div className="relative w-full md:w-72">
                    <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Cari makanan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-green-400 outline-none"
                    />
                </div>
            </div>

            {/* FILTER */}
            <div className="flex gap-3 mb-6">
                <button className="flex items-center gap-2 bg-[#5FD5E7] text-white px-4 py-2 rounded-xl text-sm shadow">
                    <FaStar size={12} />
                    Populer
                </button>

                <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-50">
                    <FaClock size={12} />
                    Terbaru
                </button>

                <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-50">
                    <FaSortAmountDown size={12} />
                    Harga
                </button>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filtered.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* IMAGE */}
                        <div className="relative bg-gray-50 rounded-xl h-36 flex items-center justify-center overflow-hidden">
                            <img
                                src={item.gambar}
                                alt={item.nama}
                                className="h-28 object-contain hover:scale-110 transition"
                            />

                            {/* LOVE */}
                            <FaHeart className="absolute top-2 left-2 text-gray-300 hover:text-red-500 cursor-pointer" />
                        </div>

                        {/* INFO */}
                        <div className="mt-3">
                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                {item.nama}
                            </h3>

                            {/* 🔥 TERJUAL */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <FaShoppingCart size={10} className="text-gray-400" />
                                <span>
                                    {item.terjual >= 1000
                                        ? (item.terjual / 1000).toFixed(1) + "rb"
                                        : item.terjual} terjual
                                </span>
                            </div>

                            <p className="text-sm font-bold text-gray-900 mt-1">
                                Rp {item.harga.toLocaleString("id-ID")}
                            </p>

                            {/* STOK */}
                            <div className="mt-3">
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-gray-500">Stok</span>
                                    <span
                                        className={`font-semibold ${
                                            item.stok === 0
                                                ? "text-gray-400"
                                                : item.stok <= 5
                                                ? "text-red-500"
                                                : "text-green-600"
                                        }`}
                                    >
                                        {item.stok === 0
                                            ? "Habis"
                                            : item.stok <= 5
                                            ? "Hampir Habis"
                                            : "Tersedia"}
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            item.stok === 0
                                                ? "bg-gray-400"
                                                : item.stok <= 5
                                                ? "bg-red-500"
                                                : "bg-green-500"
                                        }`}
                                        style={{
                                            width: `${Math.min((item.stok / 25) * 100, 100)}%`,
                                        }}
                                    ></div>
                                </div>

                                <p className="text-[11px] text-gray-400 mt-1">
                                    {item.stok} item tersisa
                                </p>
                            </div>
                        </div>

                        {/* BUTTON */}
                        <button
                            disabled={item.stok === 0}
                            className={`mt-4 w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition ${
                                item.stok === 0
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-[#1FB98E] hover:bg-green-600 text-white"
                            }`}
                        >
                            <FaShoppingCart size={12} />
                            {item.stok === 0 ? "Habis" : "Tambah"}
                        </button>
                    </div>
                ))}
            </div>

        </AppLayout>
    );
}
