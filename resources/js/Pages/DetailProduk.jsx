import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppLayout from "../Layouts/AppLayout";
import { FaShoppingCart } from "react-icons/fa";
import { API_BASE_URL } from "../api";
import { useCart } from "../context/CartContext";

export default function DetailProduk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [produk, setProduk] = useState(null);
    const [produkSerupa, setProdukSerupa] = useState([]);
    const [qty, setQty] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [loadingCart, setLoadingCart] = useState(false);

    useEffect(() => {
        // Gunakan endpoint khusus untuk single produk
        fetch(`${API_BASE_URL}/api/produk/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setProduk(data);
                    // Fetch semua produk untuk produk serupa
                    return fetch(`${API_BASE_URL}/api/produk`);
                }
            })
            .then((res) => res?.json())
            .then((allData) => {
                if (!allData) return;
                const allProducts = allData.data || allData;
                const similar = allProducts.filter(
                    (item) =>
                        item.id_produk !== Number(id) &&
                        item.id_kat_fk_p === produk?.id_kat_fk_p,
                );
                setProdukSerupa(similar);
            })
            .catch((err) => console.error(err));
    }, [id]);

    const handleAddToCart = (e) => {
        if (!produk || loadingCart || produk.stok === 0) return;

        setLoadingCart(true);

        const rect = e.currentTarget.getBoundingClientRect();
        const startPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        addToCart(produk.id_produk, qty, startPosition, produk)
            .then(() => {
                setLoadingCart(false);
            })
            .catch(() => {
                setLoadingCart(false);
            });
    };

    const buyNow = (e) => {
        if (!produk) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const startPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        addToCart(produk.id_produk, qty, startPosition, produk)
            .then(() => {
                navigate("/keranjang");
            })
            .catch(() => {
                // Still navigate even if failed
                navigate("/keranjang");
            });
    };

    if (!produk) {
        return <AppLayout role="pengguna">Loading...</AppLayout>;
    }

    return (
        <AppLayout role="pengguna">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* BREADCRUMB */}
                <div className="text-sm text-gray-500 mb-4">
                    Home / {produk.kategori?.nama_kategori} /{" "}
                    {produk.nama_produk}
                </div>

                {/* DETAIL PRODUK */}
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* GAMBAR */}
                        <div>
                            <div className="bg-gray-50 rounded-3xl  h-[500px] flex items-center justify-center">
                                <img
                                    src={`${API_BASE_URL}/storage/${produk.gambar?.[activeImage]?.url_gambar}`}
                                    alt={produk.nama_produk}
                                    className="max-h-[400px] object-contain"
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                {produk.gambar?.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition ${
                                            activeImage === index
                                                ? "border-[#1297C9]"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <img
                                            src={`${API_BASE_URL}/storage/${img.url_gambar}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="flex flex-col">
                            <div className="inline-flex w-fit px-3 py-1 rounded-full bg-blue-50 text-[#1297C9] text-sm font-medium">
                                {produk.kategori?.nama_kategori}
                            </div>

                            <h1 className="text-4xl font-bold mt-3 text-gray-800">
                                {produk.nama_produk}
                            </h1>

                            {/* HARGA */}
                            <div className="bg-blue-50 rounded-2xl p-6 mt-6">
                                <p className="text-gray-500 text-sm">Harga</p>

                                <h2 className="text-4xl font-bold text-[#1297C9]">
                                    Rp{" "}
                                    {produk.harga_jual.toLocaleString("id-ID")}
                                </h2>
                            </div>

                            {/* STOK */}
                            <div className="flex gap-10 mt-6 border-b pb-6">
                                <div>
                                    <p className="text-gray-400 text-sm">
                                        Stok
                                    </p>

                                    <p className="font-bold text-green-600">
                                        {produk.stok} tersedia
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm">
                                        Terjual
                                    </p>

                                    <p className="font-bold">
                                        {produk.terjual || 0}
                                    </p>
                                </div>
                            </div>

                            {/* QTY */}
                            <div className="flex items-center gap-5 mt-6">
                                <span className="text-gray-500">Jumlah</span>

                                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() =>
                                            setQty(qty > 1 ? qty - 1 : 1)
                                        }
                                        className="w-12 h-12 bg-gray-100"
                                    >
                                        -
                                    </button>

                                    <div className="w-14 text-center font-semibold">
                                        {qty}
                                    </div>

                                    <button
                                        onClick={() => setQty(qty + 1)}
                                        className="w-12 h-12 bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* BUTTON */}
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loadingCart || produk.stok === 0}
                                    className="h-14 rounded-2xl border-2 text-[#1766D3] font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaShoppingCart />
                                    {loadingCart ? "Memuat..." : "Keranjang"}
                                </button>

                                <button
                                    onClick={buyNow}
                                    disabled={produk.stok === 0}
                                    className="h-14 rounded-2xl bg-[#1766D3] text-white font-semibold hover:bg-[#0f7ba5] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Beli Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deskripsi */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-lg mt-10">
                    <h2 className="font-semibold text-lg mb-5">
                        Deskripsi Produk
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {produk.deskripsi}
                    </p>
                </div>

                {/* PRODUK SERUPA */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Produk Serupa</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {produkSerupa.map((item) => (
                            <Link
                                key={item.id_produk}
                                to={`/detail-produk/${item.id_produk}`}
                                className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg transition block"
                            >
                                <img
                                    src={`${API_BASE_URL}/storage/${item.gambar?.[0]?.url_gambar}`}
                                    alt={item.nama_produk}
                                    className="h-40 w-full object-contain"
                                />

                                <h3 className="mt-3 font-medium text-gray-800">
                                    {item.nama_produk}
                                </h3>

                                <p className="text-[#1297C9] font-bold mt-2">
                                    Rp {item.harga_jual.toLocaleString("id-ID")}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {item.terjual || 0} terjual
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
