import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaShoppingCart,
    FaSearch,
    FaHeart,
    FaSortAmountDown,
    FaRedo,
    FaTimes,
    FaBoxOpen,
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

    // ── Fetch produk ──────────────────────────────────────────────
    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(`${API_BASE_URL}/api/produk`)
            .then((res) => {
                if (!res.ok) throw new Error("Gagal memuat produk");
                return res.json();
            })
            .then((data) => {
                const kategoriMap = {
                    makanan: "makanan",
                    minuman: "minuman",
                    obat: "obat",
                    "alat-tulis": "alat",
                    almamater: "almamater",
                };

                const keyword = kategoriMap[kategori];
                const filteredKategori = keyword
                    ? data.filter((item) =>
                          item.kategori?.nama_kategori
                              ?.toLowerCase()
                              .includes(keyword),
                      )
                    : data;

                setProducts(filteredKategori);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [kategori]);

    // ── Tambah ke keranjang ───────────────────────────────────────
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

    // ── Toggle wishlist (local state) ─────────────────────────────
    const toggleWishlist = (e, idProduk) => {
        e.stopPropagation();
        setWishlist((prev) =>
            prev.includes(idProduk)
                ? prev.filter((id) => id !== idProduk)
                : [...prev, idProduk],
        );
    };

    // ── Filter & sort ─────────────────────────────────────────────
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

    // ── Render ────────────────────────────────────────────────────
    return (
        <AppLayout role="pengguna">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">
                        {kategori?.replace("-", " ")}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Temukan produk terbaik di kategori ini
                    </p>
                </div>

                <div className="flex flex-col md:items-center md:flex-row gap-3 w-full md:w-auto md:ml-auto">
                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <FaSortAmountDown className="text-gray-500" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white hover:bg-gray-100 focus:outline-none"
                        >
                            <option value="terlaris">Terlaris</option>
                            <option value="terbaru">Terbaru</option>
                        </select>
                    </div>

                    {/* Range Harga */}
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

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full rounded-xl border border-gray-300 text-sm bg-white focus:outline-none"
                        />
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {filtered.map((item) => (
                        <div
                            key={item.id_produk}
                            onClick={() =>
                                navigate(`/detail-produk/${item.id_produk}`)
                            }
                            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                        >
                            <div className="relative bg-gray-50 rounded-xl h-36 flex items-center justify-center overflow-hidden">
                                <ProductImageSlider images={item.gambar} />
                                {/* Wishlist button */}
                                <button
                                    onClick={(e) =>
                                        toggleWishlist(e, item.id_produk)
                                    }
                                    className="absolute top-2 left-2"
                                >
                                    <FaHeart
                                        className={`transition-colors ${
                                            wishlist.includes(item.id_produk)
                                                ? "text-red-500"
                                                : "text-gray-300 hover:text-red-400"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="mt-3 space-y-1">
                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                                    {item.nama_produk}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {item.terjual} terjual
                                </p>
                                {item.diskon ? (
                                    <>
                                        <p className="text-xs text-gray-400 line-through">
                                            Rp{" "}
                                            {Number(
                                                item.harga_jual,
                                            ).toLocaleString("id-ID")}
                                        </p>

                                        <p className="text-base font-bold text-[#1297C9]">
                                            Rp{" "}
                                            {Number(
                                                item.harga_setelah_diskon,
                                            ).toLocaleString("id-ID")}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-base font-bold text-[#1297C9]">
                                        Rp{" "}
                                        {Number(item.harga_jual).toLocaleString(
                                            "id-ID",
                                        )}
                                    </p>
                                )}
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

                            {/* Tambah ke keranjang */}
                            <button
                                disabled={
                                    item.stok === 0 ||
                                    loadingKeranjang === item.id_produk
                                }
                                onClick={(e) =>
                                    handleTambahKeranjang(e, item.id_produk, item)
                                }
                                className={`mt-4 w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                                    item.stok === 0
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-[#1766D3] hover:bg-[#3D8FFF] active:scale-95 text-white shadow-sm"
                                }`}
                            >
                                <FaShoppingCart size={12} />
                                {loadingKeranjang === item.id_produk
                                    ? "Menambahkan..."
                                    : item.stok === 0
                                      ? "Habis"
                                      : "Tambah"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
