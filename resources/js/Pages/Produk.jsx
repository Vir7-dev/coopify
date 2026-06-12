import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
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

function ProductImageSlider({ images }) {
    const [current, setCurrent] = useState(0);
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        if (!isHover || !images || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrent((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [isHover, images]);

    if (!images || images.length === 0) {
        return (
            <div className="h-28 flex items-center justify-center text-gray-400">
                Tidak ada gambar
            </div>
        );
    }

    return (
        <div
            className="relative h-full w-full flex items-center justify-center"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => {
                setIsHover(false);
                setCurrent(0);
            }}
        >
            <img
                src={`http://127.0.0.1:8000/storage/${images[current].url_gambar}`}
                alt=""
                className="h-28 object-contain mx-auto transition-all duration-500"
            />

            {images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${
                                current === i
                                    ? "bg-[#1297C9] w-4"
                                    : "bg-gray-300"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

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

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/produk")
            .then((res) => res.json())
            .then((data) => {
                let filteredKategori = data;

                if (kategori === "makanan") {
                    filteredKategori = data.filter(
                        (item) =>
                            item.kategori?.nama_kategori?.toLowerCase() ===
                            "makanan",
                    );
                } else if (kategori === "minuman") {
                    filteredKategori = data.filter(
                        (item) =>
                            item.kategori?.nama_kategori?.toLowerCase() ===
                            "minuman",
                    );
                } else if (kategori === "obat") {
                    filteredKategori = data.filter((item) =>
                        item.kategori?.nama_kategori
                            ?.toLowerCase()
                            .includes("obat"),
                    );
                } else if (kategori === "alat-tulis") {
                    filteredKategori = data.filter((item) =>
                        item.kategori?.nama_kategori
                            ?.toLowerCase()
                            .includes("alat"),
                    );
                } else if (kategori === "almamater") {
                    filteredKategori = data.filter(
                        (item) =>
                            item.kategori?.nama_kategori?.toLowerCase() ===
                            "almamater",
                    );
                }

                setProducts(filteredKategori);
            });
    }, [kategori]);

    let filtered = products.filter((item) =>
        item.nama_produk?.toLowerCase().includes(search.toLowerCase()),
    );

    filtered = filtered.filter((item) => {
        const min = minHarga ? parseInt(minHarga) : 0;
        const max = maxHarga ? parseInt(maxHarga) : Infinity;
        return item.harga_jual >= min && item.harga_jual <= max;
    });

    // SORTING
    if (sortBy === "terlaris") {
        filtered.sort((a, b) => b.terjual - a.terjual);
    } else if (sortBy === "terbaru") {
        filtered.sort((a, b) => b.id - a.id);
    }

    const navigate = useNavigate();

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
                        key={item.id_produk}
                        onClick={() => navigate(`/detail-produk/${item.id_produk}`)}
                        className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                    >
                        <div className="relative bg-gray-50 rounded-xl h-36 flex items-center justify-center overflow-hidden">
                            <ProductImageSlider images={item.gambar} />
                            <FaHeart className="absolute top-2 left-2 text-gray-300 hover:text-red-500 cursor-pointer" />
                        </div>

                        <div className="mt-3 space-y-1">
                            <h3 className="text-sm font-semibold text-gray-800">
                                {item.nama_produk}
                            </h3>

                            <p className="text-xs text-gray-500">
                                {item.terjual} terjual
                            </p>

                            <p className="text-base font-bold text-[#1297C9]">
                                Rp {item.harga_jual.toLocaleString("id-ID")}
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
