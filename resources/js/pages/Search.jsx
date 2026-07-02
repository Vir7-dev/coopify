import React, { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
    FaShoppingCart,
    FaSearch,
    FaSortAmountDown,
    FaRedo,
    FaTimes,
    FaChevronRight,
    FaChevronLeft,
} from "react-icons/fa";
import { API_BASE_URL } from "../api";
import { useCart } from "../context/CartContext";

function SearchPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loadingCart, setLoadingCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("terlaris");
    const [minHarga, setMinHarga] = useState("");
    const [maxHarga, setMaxHarga] = useState("");
    const [showHarga, setShowHarga] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const { addToCart } = useCart();

    const resetHarga = () => {
        setMinHarga("");
        setMaxHarga("");
    };
    const location = useLocation();
    const navigate = useNavigate();

    const keyword = new URLSearchParams(location.search).get("q") || "";
    const kategoriId = new URLSearchParams(location.search).get("kategori") || "";

    useEffect(() => {
        setSearch(keyword);
    }, [keyword]);

    const fetchProducts = (page = 1) => {
        if (!keyword && !kategoriId) {
            setProducts([]);
            return;
        }

        setLoading(true);

        // Build query params
        const params = new URLSearchParams();
        if (keyword) params.append("q", keyword);
        if (kategoriId) params.append("kategori", kategoriId);
        params.append("page", page);

        axios
            .get(`${API_BASE_URL}/api/produk/search?${params.toString()}`)
            .then((res) => {
                const data = res.data;
                setProducts(data.data || data);
                if (data.current_page) {
                    setCurrentPage(data.current_page);
                    setLastPage(data.last_page);
                    setTotal(data.total);
                }
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts(1);
    }, [keyword, kategoriId]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
            fetchProducts(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            navigate(`/search?q=${search}`);
        }
    };

    const handleAddToCart = (e, item) => {
        e.stopPropagation(); // Prevent navigation to detail page
        if (item.stok === 0) return;
        setLoadingCart(item.id_produk);

        const rect = e.currentTarget.getBoundingClientRect();
        const startPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        addToCart(item.id_produk, 1, startPosition, item)
            .then(() => {
                setLoadingCart(null);
            })
            .catch(() => {
                setLoadingCart(null);
            });
    };

    let filtered = [...products];

    filtered = filtered.filter((item) => {
        const min = minHarga ? parseInt(minHarga) : 0;
        const max = maxHarga ? parseInt(maxHarga) : Infinity;

        return (
            Number(item.harga_jual) >= min &&
            Number(item.harga_jual) <= max
        );
    });

    if (sortBy === "terbaru") {
        filtered.sort((a, b) => b.id_produk - a.id_produk);
    }

    return (
        <AppLayout role="pengguna">
            <div className="bg-gray-100 min-h-screen p-4 sm:p-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-1 text-[#1766D3] hover:text-[#0f7ba5] font-medium"
                        >
                            <FaChevronLeft size={18} />
                        </button>

                        <div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-1">
                                <Link to="/" className="hover:text-[#1766D3]">Beranda</Link>
                                <FaChevronRight className="text-xs" />
                                <span>
                                    {kategoriId ? "Kategori" : "Pencarian"}
                                </span>
                                {(keyword || kategoriId) && (
                                    <>
                                        <FaChevronRight className="text-xs" />
                                        <span className="text-gray-700 font-medium">
                                            {keyword || "Semua Produk"}
                                        </span>
                                    </>
                                )}
                            </div>

                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                                {kategoriId ? "Kategori Produk" : keyword ? "Hasil Pencarian" : "Semua Produk"}
                            </h2>

                            {total > 0 && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {total} produk ditemukan
                                </p>
                            )}
                        </div>
                    </div>

                    {/* FILTER CONTROLS */}
                    <div className="flex flex-col gap-3 w-full">
                        {/* Filter Buttons Row */}
                        <div className="flex flex-wrap items-center gap-2">
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
                                        value={minHarga}
                                        onChange={(e) => setMinHarga(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "-" || e.key === "+" || e.key === "e") {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder="0"
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
                                        value={maxHarga}
                                        onChange={(e) => setMaxHarga(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "-" || e.key === "+" || e.key === "e") {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder="∞"
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
                {/* LOADING */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm animate-pulse">
                                <div className="bg-gray-200 h-28 sm:h-36 rounded-xl mb-3 sm:mb-4" />
                                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* PRODUK */}
                {!loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">

                        {filtered.map((item) => (

                            <div
                                key={item.id_produk}
                                onClick={() =>
                                    navigate(`/detail-produk/${item.id_produk}`)
                                }
                                className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                            >

                                <div className="relative bg-gray-50 rounded-xl h-28 sm:h-36 flex items-center justify-center overflow-hidden">

                                    <img
                                        src={
                                            item.gambar &&
                                                item.gambar.length > 0
                                                ? `${API_BASE_URL}/storage/${item.gambar[0].url_gambar}`
                                                : "/img/default.png"
                                        }
                                        alt={item.nama_produk}
                                        className="h-20 sm:h-28 object-contain mx-auto transition-all duration-500"
                                    />

                                </div>

                                <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1">

                                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
                                        {item.nama_produk}
                                    </h3>

                                    <p className="text-[10px] sm:text-xs text-gray-500">
                                        {item.terjual || 0} terjual
                                    </p>

                                    <p className="text-xs sm:text-base font-bold text-[#1297C9]">
                                        Rp{" "}
                                        {Number(
                                            item.harga_jual
                                        ).toLocaleString("id-ID")}
                                    </p>

                                    <p
                                        className={`text-[10px] sm:text-xs font-semibold ${item.stok === 0
                                            ? "text-gray-400"
                                            : item.stok < 5
                                                ? "text-red-500"
                                                : "text-green-600"
                                            }`}
                                    >
                                        {item.stok > 0
                                            ? `Stok: ${item.stok} tersedia`
                                            : "Stok Habis"}
                                    </p>

                                    <button
                                        onClick={(e) => handleAddToCart(e, item)}
                                        disabled={
                                            item.stok === 0 ||
                                            loadingCart === item.id_produk
                                        }
                                        className={`mt-2 sm:mt-4 w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all ${item.stok === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-[#1766D3] hover:bg-[#3D8FFF] active:scale-95 text-white shadow-sm"
                                            }`}
                                    >
                                        <FaShoppingCart size={10} className="sm:w-3 sm:h-3" />

                                        {loadingCart === item.id_produk
                                            ? "..."
                                            : "Tambah"}
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

                {!loading && products.length === 0 && (keyword || kategoriId) && (
                    <div className="text-center mt-10 bg-white rounded-2xl p-10 shadow-sm">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaSearch className="text-3xl text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-lg mb-2">Produk tidak ditemukan</p>
                        <p className="text-gray-400 text-sm mb-4">Coba kata kunci lain atau kategori berbeda</p>
                        <button
                            onClick={() => navigate("/")}
                            className="text-[#1766D3] font-medium hover:underline"
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                )}

                {!loading && !keyword && !kategoriId && (
                    <div className="text-center mt-10 bg-white rounded-2xl p-10 shadow-sm">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaSearch className="text-3xl text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-lg mb-4">Silakan masukkan kata kunci pencarian</p>
                    </div>
                )}

                {/* PAGINATION */}
                {!loading && lastPage > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Prev
                        </button>

                        {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
                            let pageNum;
                            if (lastPage <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= lastPage - 2) {
                                pageNum = lastPage - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1 rounded-lg border ${
                                        currentPage === pageNum
                                            ? "bg-[#1766D3] text-white border-[#1766D3]"
                                            : "border-gray-300 bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage}
                            className="px-3 py-1 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* TOTAL RESULTS INFO */}
                {!loading && filtered.length > 0 && (
                    <div className="text-center text-sm text-gray-500 mt-4">
                        Menampilkan {filtered.length} dari {total} hasil
                    </div>
                )}

            </div>
        </AppLayout>
    );
}

export default SearchPage;