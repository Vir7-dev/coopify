import React, { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { DynIcon } from "../constants/icons.jsx";

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCart, setLoadingCart] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/produk")
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
                setProducts(data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        axios.get("/api/kategori")
            .then(res => setCategories(res.data))
            .catch(err => console.log(err));
    }, []);

    const addToCart = (item) => {
        setLoadingCart(item.id_produk);

        axios.post("/api/keranjang", {
            id_produk: item.id_produk,
            jumlah: 1
        })
            .then(res => alert(res.data.message))
            .catch(() => alert("Gagal menambah keranjang"))
            .finally(() => setLoadingCart(null));
    };

    return (
        <AppLayout role="pengguna">
            <div className="bg-gray-100 min-h-screen">

                {/* BANNER */}
                <div className="px-6 md:px-10 mt-6">
                    <div
                        className="h-[400px] rounded-2xl overflow-hidden flex items-center"
                        style={{
                            backgroundImage: "url('/img/bg2.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="bg-black/40 w-full h-full flex items-center px-10 text-white">
                            <div>
                                <h1 className="text-4xl font-bold">
                                    Koperasi Digital
                                </h1>

                                <p className="mt-3 text-lg">
                                    Belanja cepat & mudah untuk semua kebutuhan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KATEGORI */}
                <div className="px-6 md:px-10 mt-10">

                    <h2 className="text-2xl font-bold mb-5">
                        Kategori Produk
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/produk/${cat.nama.toLowerCase()}`}
                                className="bg-white p-5 rounded-2xl flex flex-col items-center shadow hover:-translate-y-2 hover:shadow-xl transition-all"
                            >
                                <div className="text-3xl text-blue-600">
                                    <DynIcon name={cat.ikon} size={28} />
                                </div>

                                <p className="mt-3 font-medium">
                                    {cat.nama}
                                </p>
                            </Link>
                        ))}

                    </div>

                </div>

                {/* PRODUK */}
                <div className="px-6 md:px-10 mt-10">

                    <h2 className="text-2xl font-bold mb-5">
                        Produk Terbaru
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

                        {products.map((item) => (

                            <div
                                key={item.id_produk}
                                onClick={() =>
                                    navigate(`/detail-produk/${item.id_produk}`)
                                }
                                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                            >

                                <div className="relative bg-gray-50 rounded-xl h-36 flex items-center justify-center overflow-hidden">

                                    <img
                                        src={
                                            item.gambar &&
                                                item.gambar.length > 0
                                                ? `http://127.0.0.1:8000/storage/${item.gambar[0].url_gambar}`
                                                : "/img/default.png"
                                        }
                                        alt={item.nama_produk}
                                        className="h-28 object-contain mx-auto"
                                    />

                                </div>

                                <div className="mt-3 space-y-1">

                                    <h3 className="text-sm font-semibold text-gray-800">
                                        {item.nama_produk}
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        Produk Koperasi
                                    </p>

                                    <p className="text-base font-bold text-[#1297C9]">
                                        Rp {Number(item.harga_jual).toLocaleString("id-ID")}
                                    </p>

                                    <p
                                        className={`text-xs font-semibold ${item.stok === 0
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
                                        : "bg-[#1766D3] text-white shadow-sm"
                                        }`}
                                >
                                    <FaShoppingCart size={12} />

                                    {loadingCart === item.id_produk
                                        ? "Loading..."
                                        : item.stok === 0
                                            ? "Habis"
                                            : "Tambah"}
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
