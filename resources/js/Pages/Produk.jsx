import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useParams } from "react-router-dom";
import {
    FaShoppingCart,
    FaSearch,
    FaHeart,
    FaStar,
    FaClock,
    FaSortAmountDown,
    FaRedo,
    FaTimes,
} from "react-icons/fa";

export default function Produk() {
    const { kategori } = useParams();
    const [sortBy, setSortBy] = useState("terlaris");
    const [minHarga, setMinHarga] = useState("");
    const [maxHarga, setMaxHarga] = useState("");
    const [search, setSearch] = useState("");
    const [showHarga, setShowHarga] = useState(false);
    const resetHarga = () => {
        setMinHarga("");
        setMaxHarga("");
    };

    const allProducts = {
        makanan: [
            {
                id: 1,
                nama: "Pocky",
                harga: 5000,
                stok: 10,
                terjual: 120,
                gambar: "/img/pocky.jpg",
            },
            {
                id: 2,
                nama: "Boncabe",
                harga: 6000,
                stok: 5,
                terjual: 80,
                gambar: "/img/boncabe.jpg",
            },
            {
                id: 3,
                nama: "Brownies",
                harga: 8000,
                stok: 5,
                terjual: 80,
                gambar: "/img/brownies.jpg",
            },
            {
                id: 4,
                nama: "Chitato",
                harga: 7000,
                stok: 5,
                terjual: 80,
                gambar: "/img/chitato.jpg",
            },
            {
                id: 5,
                nama: "Yupi",
                harga: 2000,
                stok: 5,
                terjual: 80,
                gambar: "/img/yupi.jpg",
            },
            {
                id: 6,
                nama: "Yupi",
                harga: 7000,
                stok: 5,
                terjual: 80,
                gambar: "/img/yupi.jpg",
            },
        ],
        minuman: [
            {
                id: 7,
                nama: "Teh Botol",
                harga: 5000,
                stok: 20,
                terjual: 200,
                gambar: "/img/teh_botol.jpg",
            },
            {
                id: 8,
                nama: "Teh Pucuk",
                harga: 3000,
                stok: 30,
                terjual: 300,
                gambar: "/img/teh_pucuk.jpg",
            },
            {
                id: 9,
                nama: "Pocari",
                harga: 3000,
                stok: 30,
                terjual: 300,
                gambar: "/img/pocari.jpg",
            },
            {
                id: 10,
                nama: "Nipis Madu",
                harga: 3000,
                stok: 30,
                terjual: 300,
                gambar: "/img/nipis_madu.jpg",
            },
            {
                id: 11,
                nama: "Good Day",
                harga: 3000,
                stok: 30,
                terjual: 300,
                gambar: "/img/good_day.jpg",
            },
            {
                id: 12,
                nama: "Good Day",
                harga: 3000,
                stok: 30,
                terjual: 300,
                gambar: "/img/good_day.jpg",
            },
        ],
        "alat-tulis": [
            {
                id: 13,
                nama: "Pulpen",
                harga: 3000,
                stok: 50,
                terjual: 150,
                gambar: "/img/pena.jpg",
            },
            {
                id: 14,
                nama: "Buku",
                harga: 10000,
                stok: 20,
                terjual: 90,
                gambar: "/img/buku.jpg",
            },
            {
                id: 15,
                nama: "Lem",
                harga: 10000,
                stok: 20,
                terjual: 90,
                gambar: "/img/lem.jpg",
            },
            {
                id: 16,
                nama: "Penghapus",
                harga: 10000,
                stok: 20,
                terjual: 90,
                gambar: "/img/penghapus.jpg",
            },
            {
                id: 17,
                nama: "Tip-X",
                harga: 10000,
                stok: 20,
                terjual: 90,
                gambar: "/img/tipex.jpg",
            },
            {
                id: 18,
                nama: "Tip-X",
                harga: 10000,
                stok: 20,
                terjual: 90,
                gambar: "/img/tipex.jpg",
            },
        ],
        obat: [
            {
                id: 19,
                nama: "Hansaplas",
                harga: 5000,
                stok: 15,
                terjual: 70,
                gambar: "/img/hansaplas.jpg",
            },
            {
                id: 20,
                nama: "Minyak Kayu Putih",
                harga: 9000,
                stok: 12,
                terjual: 55,
                gambar: "/img/minyak.jpg",
            },
            {
                id: 21,
                nama: "Promag",
                harga: 6000,
                stok: 8,
                terjual: 40,
                gambar: "/img/promag.jpg",
            },
            {
                id: 22,
                nama: "Tolak Angin",
                harga: 4000,
                stok: 20,
                terjual: 120,
                gambar: "/img/tolak_angin.jpg",
            },
            {
                id: 23,
                nama: "Insto",
                harga: 4000,
                stok: 20,
                terjual: 120,
                gambar: "/img/insto.jpg",
            },
            {
                id: 24,
                nama: "Insto",
                harga: 4000,
                stok: 20,
                terjual: 120,
                gambar: "/img/insto.jpg",
            },
        ],
        almamater: [
            {
                id: 25,
                nama: "Jaket Almamater",
                harga: 200000,
                stok: 5,
                terjual: 30,
                gambar: "/img/almet.png",
            },
        ],
    };

    const products = allProducts[kategori] || [];

    let filtered = products.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase()),
    );

    filtered = filtered.filter((item) => {
        const min = minHarga ? parseInt(minHarga) : 0;
        const max = maxHarga ? parseInt(maxHarga) : Infinity;
        return item.harga >= min && item.harga <= max;
    });

    // SORTING
    if (sortBy === "terlaris") {
        filtered.sort((a, b) => b.terjual - a.terjual);
    } else if (sortBy === "terbaru") {
        filtered.sort((a, b) => b.id - a.id);
    }

    return (
        <AppLayout role="pengguna">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">
                        {kategori}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Temukan produk terbaik di kategori ini
                    </p>
                </div>

                <div className="flex flex-col md:items-center md:flex-row gap-3 w-full md:w-auto md:ml-auto">
                    <div className="flex items-center gap-2">
                        <FaSortAmountDown className="text-gray-500" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white hover:bg-gray-100 focus:outline-none focus:ring-0 "
                        >
                            <option value="terlaris">Terlaris</option>
                            <option value="terbaru">Terbaru</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setShowHarga(!showHarga)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition whitespace-nowrap"
                    >
                        Range Harga
                    </button>

                    {showHarga && (
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-300">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minHarga}
                                onChange={(e) => setMinHarga(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                            />

                            <span className="text-gray-400">-</span>

                            <input
                                type="number"
                                placeholder="Max"
                                value={maxHarga}
                                onChange={(e) => setMaxHarga(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                            />

                            <button
                                onClick={resetHarga}
                                className="text-gray-500 hover:text-blue-500"
                                title="Reset harga"
                            >
                                <FaRedo />
                            </button>

                            <button
                                onClick={() => setShowHarga(false)}
                                className="text-gray-500 hover:text-red-500"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}

                    <div className="relative w-full md:w-72">
                        <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

                {filtered.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                    >

                        <div className="relative bg-gray-50 rounded-xl h-36 flex items-center justify-center overflow-hidden">
                            <img
                                src={item.gambar}
                                alt={item.nama}
                                className="h-28 object-contain hover:scale-110 transition"
                            />
                            <FaHeart className="absolute top-2 left-2 text-gray-300 hover:text-red-500 cursor-pointer" />
                        </div>

                        <div className="mt-3 space-y-1">
                            <h3 className="text-sm font-semibold text-gray-800">
                                {item.nama}
                            </h3>

                            <p className="text-xs text-gray-500">
                                {item.terjual} terjual
                            </p>

                            <p className="text-base font-bold text-[#1297C9]">
                                Rp {item.harga.toLocaleString("id-ID")}
                            </p>

                            <p
                                className={`text-xs font-semibold ${
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
                            className={`mt-4 w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                                item.stok === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-[#1766D3] hover:[#3D8FFF] active:scale-95 text-white shadow-sm"
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
