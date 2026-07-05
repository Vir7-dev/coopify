import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaShoppingCart,
    FaSearch,
    FaSortAmountDown,
    FaRedo,
    FaTimes,
    FaBoxOpen,
    FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useCart } from "../context/CartContext";

function ProductImageSlider({ images }) {
    const [current, setCurrent] = useState(0);
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        if (!isHover || !images || images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [isHover, images]);

    if (!images || images.length === 0) {
        return (
            <div className="h-28 flex items-center justify-center text-gray-400 text-xs">
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
                src={`${API_BASE_URL}/storage/${images[current].url_gambar}`}
                alt=""
                className="h-28 object-contain mx-auto transition-all duration-500"
            />
            {images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={`h-2 rounded-full transition-all ${
                                current === i
                                    ? "bg-[#1297C9] w-4"
                                    : "bg-gray-300 w-2"
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
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState("terlaris");
    const [minHarga, setMinHarga] = useState("");
    const [maxHarga, setMaxHarga] = useState("");
    const [search, setSearch] = useState("");
    const [showHarga, setShowHarga] = useState(false);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loadingKeranjang, setLoadingKeranjang] = useState(null);
    const { addToCart } = useCart();

    const resetHarga = () => {
        setMinHarga("");
        setMaxHarga("");
    };
// Fetch Produk
   useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/produk`)
        .then((res) => {
            if (!res.ok) throw new Error("Gagal memuat produk");
            return res.json();
        })
        .then((res) => {
            const produk = res.data || [];

            const filteredKategori = kategori
                ? produk.filter(
                      (item) =>
                          item.kategori?.nama_kategori
                              ?.toLowerCase()
                              .replace(/\s+/g, "-") ===
                          kategori.toLowerCase()
                  )
                : produk;

            setProducts(filteredKategori);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
}, [kategori]);

    // Tambah ke Keranjang
    const handleTambahKeranjang = async (e, idProduk, productItem) => {
        e.stopPropagation();
        if (productItem.stok === 0) return;

        setLoadingKeranjang(idProduk);

        const rect = e.currentTarget.getBoundingClientRect();
        const startPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        await addToCart(idProduk, 1, startPosition, productItem);

        setLoadingKeranjang(null);
    };

    const toggleWishlist = (e, idProduk) => {
        e.stopPropagation();
        setWishlist((prev) =>
            prev.includes(idProduk)
                ? prev.filter((id) => id !== idProduk)
                : [...prev, idProduk],
        );
    };

    let filtered = products.filter((item) =>
        item.nama_produk?.toLowerCase().includes(search.toLowerCase()),
    );

    filtered = filtered.filter((item) => {
        const min = minHarga ? parseInt(minHarga) : 0;
        const max = maxHarga ? parseInt(maxHarga) : Infinity;
        return item.harga_jual >= min && item.harga_jual <= max;
    });

    if (sortBy === "terlaris") {
        filtered.sort((a, b) => b.terjual - a.terjual);
    } else if (sortBy === "terbaru") {
        filtered.sort((a, b) => b.id_produk - a.id_produk);
    }

    return (
        <AppLayout role="pengguna">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-[#1766D3] hover:text-[#0f7ba5] font-medium"
                    >
                        <FaArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
                            {kategori?.replace("-", " ")}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Temukan produk terbaik di kategori ini
                        </p>
                    </div>
                </div>

                {/* FILTER CONTROLS */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Search + Filter Row */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[180px]">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 w-full rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#1766D3] focus:ring-1 focus:ring-[#1766D3] shadow-sm"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                            <FaSortAmountDown className="text-[#1766D3] text-sm" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-xs sm:text-sm bg-transparent text-gray-700 focus:outline-none cursor-pointer"
                            >
                                <option value="terlaris">Terlaris</option>
                                <option value="terbaru">Terbaru</option>
                            </select>
                        </div>

                        {/* Range Harga Button */}
                        <button
                            onClick={() => setShowHarga(!showHarga)}
                            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm border rounded-xl transition-all shadow-sm ${
                                showHarga
                                    ? 'bg-[#1766D3] text-white border-[#1766D3]'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#1766D3] hover:text-[#1766D3]'
                            }`}
                        >
                            <span>🏷️</span>
                            <span>Range Harga</span>
                        </button>
                    </div>

                    {/* Price Range Inputs - Always rendered but hidden/shown */}
                    <div className={`flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 shadow-sm transition-all duration-300 ${showHarga ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 p-0 overflow-hidden border-0'}`}>
                        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                            <span className="text-xs text-gray-500 font-medium">Min:</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={minHarga}
                                    onChange={(e) => setMinHarga(Math.max(0, Number(e.target.value)))}
                                    className="w-full pl-8 pr-2 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1766D3] focus:ring-1 focus:ring-[#1766D3]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                            <span className="text-xs text-gray-500 font-medium">Max:</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="∞"
                                    value={maxHarga}
                                    onChange={(e) => setMaxHarga(Math.max(0, Number(e.target.value)))}
                                    className="w-full pl-8 pr-2 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1766D3] focus:ring-1 focus:ring-[#1766D3]"
                                />
                            </div>
                        </div>

                        <button
                            onClick={resetHarga}
                            className="p-2 text-gray-400 hover:text-[#1766D3] hover:bg-blue-50 rounded-lg transition-all"
                            title="Reset"
                        >
                            <FaRedo size={14} />
                        </button>

                        <button
                            onClick={() => setShowHarga(false)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Tutup"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1297C9]" />
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className="text-center py-20 text-red-500">
                    <p className="font-semibold">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 text-sm text-[#1297C9] hover:underline"
                    >
                        Coba lagi
                    </button>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <FaBoxOpen size={48} className="mb-3 opacity-40" />
                    <p className="text-sm font-medium">
                        Produk tidak ditemukan
                    </p>
                    <p className="text-xs mt-1">
                        Coba ubah filter atau kata kunci pencarian
                    </p>
                </div>
            )}

            {/* Product grid */}
            {!loading && !error && filtered.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {filtered.map((item) => (
                        <div
                            key={item.id_produk}
                            onClick={() =>
                                navigate(`/detail-produk/${item.id_produk}`)
                            }
                            className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer flex flex-col"
                        >
                            <div className="relative bg-gray-50 rounded-xl h-28 sm:h-36 flex items-center justify-center overflow-hidden">
                                <ProductImageSlider images={item.gambar} />
                            </div>

                            <div className="mt-2 sm:mt-3 flex flex-col flex-grow">
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5em] mb-1">
                                    {item.nama_produk}
                                </h3>
                                {item.diskon ? (
                                    <>
                                        <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                                            Rp{" "}
                                            {Number(
                                                item.harga_jual,
                                            ).toLocaleString("id-ID")}
                                        </p>

                                        <p className="text-xs sm:text-base font-bold text-[#1297C9]">
                                            Rp{" "}
                                            {Number(
                                                item.harga_setelah_diskon,
                                            ).toLocaleString("id-ID")}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs sm:text-base font-bold text-[#1297C9]">
                                            Rp{" "}
                                            {Number(item.harga_jual).toLocaleString(
                                                "id-ID",
                                            )}
                                        </p>
                                        <div className="h-[1.1rem]"></div>
                                    </>
                                )}
                                <p className={`text-[10px] sm:text-xs font-semibold mt-auto ${item.stok < 5 ? "text-red-500" : "text-green-600"}`}>
                                    Stok: {item.stok} tersedia
                                </p>
                            </div>

                            {/* Tambah ke keranjang */}
                            <button
                                disabled={
                                    loadingKeranjang === item.id_produk
                                }
                                onClick={(e) =>
                                    handleTambahKeranjang(e, item.id_produk, item)
                                }
                                className="mt-2 sm:mt-3 w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all bg-[#1766D3] hover:bg-[#3D8FFF] active:scale-[0.98] text-white shadow-sm"
                            >
                                <FaShoppingCart size={10} className="sm:w-3 sm:h-3" />
                                {loadingKeranjang === item.id_produk
                                    ? "..."
                                    : "Tambah"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
