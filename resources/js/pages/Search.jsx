import React, { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaShoppingCart,
    FaHeart,
    FaSearch,
    FaSortAmountDown,
    FaRedo,
    FaTimes,
} from "react-icons/fa";

function SearchPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loadingCart, setLoadingCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("terlaris");
    const [minHarga, setMinHarga] = useState("");
    const [maxHarga, setMaxHarga] = useState("");
    const [showHarga, setShowHarga] = useState(false);

    const resetHarga = () => {
        setMinHarga("");
        setMaxHarga("");
    };
    const location = useLocation();
    const navigate = useNavigate();

    const keyword =
        new URLSearchParams(location.search).get("q") || "";

    useEffect(() => {
        setSearch(keyword);
    }, [keyword]);

    useEffect(() => {
        if (!keyword) {
            setProducts([]);
            return;
        }

        setLoading(true);

        axios
            .get(`http://127.0.0.1:8000/api/produk/search?q=${keyword}`)
            .then((res) => setProducts(res.data))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, [keyword]);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            navigate(`/search?q=${search}`);
        }
    };

    const addToCart = (item) => {
        setLoadingCart(item.id_produk);

        axios
            .post("http://127.0.0.1:8000/cart/add", {
                product_id: item.id_produk,
                qty: 1,
            })
            .then((res) => alert(res.data.message))
            .catch(() => alert("Gagal menambah keranjang"))
            .finally(() => setLoadingCart(null));
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
                        <h2 className="text-3xl font-bold text-gray-800">
                            Hasil Pencarian
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Temukan produk yang Anda cari
                        </p>
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
                                    placeholder="Min"
                                    value={minHarga}
                                    onChange={(e) => setMinHarga(e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                                />

                                <span>-</span>

                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxHarga}
                                    onChange={(e) => setMaxHarga(e.target.value)}
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

                        <div className="relative w-full md:w-72">

                            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />

                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                className="pl-9 pr-4 py-2 w-full rounded-xl border border-gray-300 text-sm bg-white"
                            />

                        </div>

                    </div>

                </div>
                {/* LOADING */}
                {loading && (
                    <div className="text-center py-10">
                        Loading...
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
                                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                            >

                                <div className="relative bg-gray-50 rounded-xl h-36 flex items-center justify-center overflow-hidden">

                                    <FaHeart className="absolute top-3 left-3 text-gray-300 hover:text-red-500" />

                                    <img
                                        src={
                                            item.gambar &&
                                                item.gambar.length > 0
                                                ? `http://127.0.0.1:8000/storage/${item.gambar[0].url_gambar}`
                                                : "/img/default.png"
                                        }
                                        alt={item.nama_produk}
                                        className="h-28 object-contain mx-auto transition-all duration-500"
                                    />

                                </div>

                                <div className="mt-3 space-y-1 px-1">

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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(item);
                                        }}
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

                {!loading && products.length === 0 && keyword && (
                    <div className="text-center mt-10 text-gray-500">
                        Produk tidak ditemukan
                    </div>
                )}

                {!loading && !keyword && (
                    <div className="text-center mt-10 text-gray-500">
                        Silakan masukkan kata kunci pencarian
                    </div>
                )}

            </div>
        </AppLayout>
    );
}

export default SearchPage;