import React, { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
    FaHamburger,
    FaCoffee,
    FaPencilAlt,
    FaPills,
    FaUserGraduate,
    FaShoppingCart,
} from "react-icons/fa";

function Dashboard() {

    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loadingCart, setLoadingCart] = useState(null);

    const navigate = useNavigate();

    // ================= FETCH =================
    useEffect(() => {
        axios.get("/api/produk")
            .then(res => setProducts(res.data))
            .catch(err => console.log(err));
    }, []);

    // ================= SEARCH =================
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            navigate(`/search?q=${search}`);
        }
    };

    // ================= ADD TO CART =================
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

    // ================= KATEGORI =================
    const categories = [
        { title: "Makanan", icon: <FaHamburger /> },
        { title: "Minuman", icon: <FaCoffee /> },
        { title: "Alat Tulis", icon: <FaPencilAlt /> },
        { title: "Obat", icon: <FaPills /> },
        { title: "Almamater", icon: <FaUserGraduate /> },
    ];

    return (
        <AppLayout role="pengguna">

            <div className="bg-gray-100 min-h-screen pb-20">

                {/* ================= HEADER ================= */}
                <div className="px-6 md:px-10 pt-6 flex justify-between items-center">

                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        className="border px-4 py-2 rounded-xl w-[300px]"
                    />
                </div>

                {/* ================= BANNER ================= */}
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
                                <h1 className="text-3xl font-bold">
                                    Koperasi Digital
                                </h1>

                                <p className="mt-2">
                                    Belanja cepat & mudah untuk semua kebutuhan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= KATEGORI ================= */}
                <div className="px-6 md:px-10 mt-10">

                    <h2 className="text-xl font-bold mb-4">
                        Kategori Produk
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

                        {categories.map((cat, i) => (
                            <Link
                                key={i}
                                to={`/produk/${cat.title.toLowerCase()}`}
                                className="bg-white p-5 rounded-2xl flex flex-col items-center shadow hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className="text-2xl text-blue-600">
                                    {cat.icon}
                                </div>

                                <p className="mt-2">
                                    {cat.title}
                                </p>
                            </Link>
                        ))}

                    </div>

                </div>

                {/* ================= PRODUK ================= */}
                <div className="px-6 md:px-10 mt-10">

                    <h2 className="text-xl font-bold mb-4">
                        Produk Terbaru
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

                        {products.map(item => (

                            <div
                                key={item.id_produk}
                                className="bg-white p-4 rounded-2xl shadow hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer"
                                onClick={() => navigate(`/detail-produk/${item.id_produk}`)}
                            >

                                <div className="h-32 flex items-center justify-center">
                                    <img
                                        src="/img/default.png"
                                        alt={item.nama_produk}
                                        className="h-24 object-contain"
                                    />
                                </div>

                                <h3 className="font-semibold">
                                    {item.nama_produk}
                                </h3>

                                <p className="text-blue-600 font-bold">
                                    Rp {Number(item.harga_jual).toLocaleString("id-ID")}
                                </p>

                                <p className="text-xs">
                                    Stok: {item.stok}
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
                                    className="mt-3 w-full py-2 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2 hover:scale-105 transition"
                                >
                                    <FaShoppingCart size={12} />

                                    {loadingCart === item.id_produk
                                        ? "Loading..."
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
