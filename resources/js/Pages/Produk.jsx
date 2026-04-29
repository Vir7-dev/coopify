import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useParams } from "react-router-dom";
import { FaSearch, FaShoppingCart } from "react-icons/fa";

export default function Produk() {
    const { kategori } = useParams();
    const [search, setSearch] = useState("");

    const allProducts = {
        makanan: [
            { id: 1, nama: "Roti", harga: 5000, stok: 10 },
            { id: 2, nama: "Snack", harga: 7000, stok: 5 },
            { id: 3, nama: "Nabati", harga: 8000, stok: 8 },
            { id: 4, nama: "Roti O", harga: 5000, stok: 10 },
            { id: 5, nama: "Kalpa", harga: 7000, stok: 5 },
            { id: 6, nama: "Roma", harga: 8000, stok: 8 },
            { id: 7, nama: "Kalpa", harga: 7000, stok: 5 },
            { id: 8, nama: "Roma", harga: 8000, stok: 8 },
        ],
        minuman: [
            { id: 9, nama: "Teh Botol", harga: 5000, stok: 20 },
            { id: 10, nama: "Air Mineral", harga: 3000, stok: 30 },
            { id: 11, nama: "Jus Jeruk", harga: 8000, stok: 10 },
            { id: 12, nama: "Teh Botol", harga: 5000, stok: 20 },
            { id: 13, nama: "Air Mineral", harga: 3000, stok: 30 },
            { id: 14, nama: "Jus Jeruk", harga: 8000, stok: 10 },
            { id: 15, nama: "Air Mineral", harga: 3000, stok: 30 },
            { id: 16, nama: "Jus Jeruk", harga: 8000, stok: 10 },
        ],
        "alat-tulis": [
            { id: 17, nama: "Pulpen", harga: 3000, stok: 50 },
            { id: 18, nama: "Buku", harga: 10000, stok: 20 },
            { id: 19, nama: "Pulpen", harga: 3000, stok: 50 },
            { id: 20, nama: "Buku", harga: 10000, stok: 20 },
            { id: 21, nama: "Pulpen", harga: 3000, stok: 50 },
            { id: 22, nama: "Buku", harga: 10000, stok: 20 },
            { id: 23, nama: "Pulpen", harga: 3000, stok: 50 },
            { id: 24, nama: "Buku", harga: 10000, stok: 20 },
        ],
        obat: [
            { id: 25, nama: "Paracetamol", harga: 5000, stok: 15 },
            { id: 26, nama: "Promag", harga: 9000, stok: 12 },
            { id: 27, nama: "Paracetamol", harga: 5000, stok: 15 },
            { id: 28, nama: "Promag", harga: 9000, stok: 12 },
            { id: 29, nama: "Paracetamol", harga: 5000, stok: 15 },
            { id: 30, nama: "Promag", harga: 9000, stok: 12 },
            { id: 31, nama: "Paracetamol", harga: 5000, stok: 15 },
            { id: 32, nama: "Promag", harga: 9000, stok: 12 },
        ],
        almamater: [
            { id: 33, nama: "Jaket Almamater", harga: 200000, stok: 5 },
        ],
    };

    const products = allProducts[kategori] || [];

    const filtered = products.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AppLayout>
            <div className="bg-gray-100 min-h-screen p-6">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold capitalize">
                            Produk - {kategori}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Daftar produk kategori {kategori}
                        </p>
                    </div>

                    <div className="relative w-72">
                        <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full border rounded-xl text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden group"
                        >
                            {/* IMAGE */}
                            <div className="h-36 bg-gray-200 relative overflow-hidden">
                                {/* badge stok */}
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded">
                                    Stok {item.stok}
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="p-3">
                                <h3 className="font-semibold text-sm truncate group-hover:text-blue-500 transition">
                                    {item.nama}
                                </h3>

                                <p className="text-green-600 font-bold text-sm mt-1">
                                    Rp {item.harga.toLocaleString("id-ID")}
                                </p>

                                <p className="text-xs text-gray-400">
                                    Sisa {item.stok} produk
                                </p>

                                {/* BUTTON */}
                                <button className="mt-3 w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition">
                                    <FaShoppingCart size={12} />
                                    Tambah ke Keranjang
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
