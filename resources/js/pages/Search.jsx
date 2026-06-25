import React, { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
    FaShoppingCart,
    FaHeart,
    FaSearch,
    FaSortAmountDown,
    FaRedo,
    FaTimes,
    FaChevronRight,
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
            <div className="bg-gray-100 min-h-screen p-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
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

                        <h2 className="text-3xl font-bold text-gray-800">
                            {kategoriId ? "Kategori Produk" : keyword ? "Hasil Pencarian" : "Semua Produk"}
                        </h2>

                        {total > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                                {total} produk ditemukan
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col md:items-center md:flex-row gap-3 w-full md:w-auto md:ml-auto">

                        <div className="flex items-center gap-2">
                            <FaSortAmountDown className="text-gray-500" />

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white"
                            >
                                <option value="terlaris">
                                    Terlaris
                                </option>

                                <option value="terbaru">
                                    Terbaru
                                </option>
                            </select>
                        </div>

                        <button
                            onClick={() => setShowHarga(!showHarga)}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white"
                        >
                            Range Harga
                        </button>

                        {showHarga && (
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-300">

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
                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                                />

                                <span>-</span>

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
                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                                />

                                <button
                                    onClick={resetHarga}
                                >
                                    <FaRedo />
                                </button>

                                <button
                                    onClick={() => setShowHarga(false)}
                                >
                                    <FaTimes />
                                </button>

                            </div>
                        )}


                    </div>

                </div>
                {/* LOADING */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                                <div className="bg-gray-200 h-36 rounded-xl mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* PRODUK */}
                {!loading && (
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

                                    <FaHeart className="absolute top-3 left-3 text-gray-300 hover:text-red-500" />

                                    <img
                                        src={
                                            item.gambar &&
                                                item.gambar.length > 0
                                                ? `${API_BASE_URL}/storage/${item.gambar[0].url_gambar}`
                                                : "/img/default.png"
                                        }
                                        alt={item.nama_produk}
                                        className="h-28 object-contain mx-auto transition-all duration-500"
                                    />

                                </div>

                                <div className="mt-3 space-y-1">

                                    <h3 className="text-sm font-semibold text-gray-800">
                                        {item.nama_produk}
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        {item.terjual || 0} terjual
                                    </p>

                                    <p className="text-base font-bold text-[#1297C9]">
                                        Rp{" "}
                                        {Number(
                                            item.harga_jual
                                        ).toLocaleString("id-ID")}
                                    </p>

                                    <p
                                        className={`text-xs font-semibold ${item.stok === 0
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
                                        className={`mt-4 w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${item.stok === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-[#1766D3] hover:bg-[#3D8FFF] active:scale-95 text-white shadow-sm"
                                            }`}
                                    >
                                        <FaShoppingCart size={12} />

                                        {loadingCart === item.id_produk
                                            ? "Loading..."
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
                {!loading && total > 0 && (
                    <div className="text-center text-sm text-gray-500 mt-4">
                        Menampilkan {products.length} dari {total} hasil
                    </div>
                )}

            </div>
        </AppLayout>
    );
}

export default SearchPage;