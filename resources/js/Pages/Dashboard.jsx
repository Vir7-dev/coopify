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
import { API_BASE_URL } from "../api";
import { useCart } from "../context/CartContext";

// Icon mapping berdasarkan nama kategori
const iconMap = {
    'makanan': <FaHamburger />,
    'minuman': <FaCoffee />,
    'alat tulis': <FaPencilAlt />,
    'obat': <FaPills />,
    'almamater': <FaUserGraduate />,
    // Fallback default
};

const getCategoryIcon = (namaKategori) => {
    const lowerName = namaKategori.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerName.includes(key)) {
            return icon;
        }
    }
    return <FaShoppingCart />; // Default icon
};

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCart, setLoadingCart] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const navigate = useNavigate();
    const { addToCart } = useCart();

    const fetchProducts = (page = 1) => {
        axios.get(`/api/produk?page=${page}`)
            .then(res => {
                const data = res.data;
                setProducts(data.data || data);
                if (data.current_page) {
                    setCurrentPage(data.current_page);
                    setLastPage(data.last_page);
                    setTotalProducts(data.total);
                }
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        // Fetch kategori saja (kategori tidak perlu pagination)
        axios.get("/api/kategori")
            .then(res => setCategories(res.data))
            .catch(err => console.log(err));

        // Fetch produk dengan pagination
        fetchProducts(1);
    }, []);


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
        e.stopPropagation();
        if (item.stok === 0) return;

        setLoadingCart(item.id_produk);

        // Get button position
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

    return (
        <AppLayout role="pengguna">
            <div className="bg-gray-100 min-h-screen pb-20">


                {/* BANNER */}
                <div className="px-6 md:px-10">
                    <div
                        className="h-[400px] rounded-2xl overflow-hidden flex items-center"
                        style={{
                            backgroundImage: "url('/img/bg2.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="bg-black/20 w-full h-full flex items-center px-10 text-white">
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
                    <h2 className="text-2xl font-bold mb-5">Kategori Produk</h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/search?kategori=${cat.id}`}
                                className="bg-white p-5 rounded-2xl flex flex-col items-center shadow hover:-translate-y-2 hover:shadow-xl transition-all"
                            >
                                <div className="text-3xl text-blue-600">
                                    {getCategoryIcon(cat.nama)}
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
                    <h2 className="text-2xl font-bold mb-5">Produk Terbaru</h2>

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
                                                ? `${API_BASE_URL}/storage/${item.gambar[0].url_gambar}`
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
                                        Produk Kopi
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
                                            {Number(
                                                item.harga_jual,
                                            ).toLocaleString("id-ID")}
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

                                <button
                                    onClick={(e) => handleAddToCart(e, item)}
                                    disabled={
                                        item.stok === 0 ||
                                        loadingCart === item.id_produk
                                    }
                                    className={`mt-4 w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                                        item.stok === 0
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

                    {/* PAGINATION */}
                    {lastPage > 1 && (
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

                    {/* TOTAL PRODUCTS INFO */}
                    {totalProducts > 0 && (
                        <div className="text-center text-sm text-gray-500 mt-4">
                            Menampilkan {products.length} dari {totalProducts} produk
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
