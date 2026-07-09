import React, { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaHamburger, FaCoffee, FaPencilAlt, FaPills, FaUserGraduate } from "react-icons/fa";
import { API_BASE_URL } from "../api";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

// Icon mapping berdasarkan nama kategori
const iconMap = {
    'makanan': <FaHamburger />,
    'minuman': <FaCoffee />,
    'alat tulis': <FaPencilAlt />,
    'obat': <FaPills />,
    'almamater': <FaUserGraduate />,
};

const getCategoryIcon = (namaKategori) => {
    const lowerName = namaKategori?.toLowerCase() || '';
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerName.includes(key)) {
            return icon;
        }
    }
    return <FaShoppingCart />;
};

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCart, setLoadingCart] = useState(null);
    const [pesananSiapDiambil, setPesananSiapDiambil] = useState([]);
    const [dismissedWarnings, setDismissedWarnings] = useState(new Set());

    const navigate = useNavigate();
    const { addToCart } = useCart();

    const fetchProducts = (page = 1) => {
        axios.get(`/api/produk`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.data;

                setProducts(data.slice(0, 18));
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        axios.get("/api/kategori")
            .then(res => setCategories(res.data))
            .catch(err => console.log(err));

        fetchProducts();

        // Fetch pesanan siap diambil untuk warning
        axios.get("/api/profil-pengguna/notifikasi")
            .then(res => {
                // Filter hanya yang status 'siap diambil'
                const siapDiambil = res.data.notifikasi.filter(n => n.status === 'siap diambil');
                setPesananSiapDiambil(siapDiambil);
            })
            .catch(err => console.log(err));
    }, []);

    // Fungsi untuk menghitung sisa waktu pengambilan
    const getRemainingPickupTime = (wktPengambilan) => {
        if (!wktPengambilan) return null;
        // Parse format "dd MMM YYYY - HH:mm"
        const months = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const parts = wktPengambilan.split(' - ');
        if (parts.length !== 2) return null;
        const dateParts = parts[0].split(' ');
        const timeParts = parts[1].split(':');
        const deadline = new Date(
            parseInt(dateParts[2]),
            months[dateParts[1]] || 0,
            parseInt(dateParts[0]),
            parseInt(timeParts[0]),
            parseInt(timeParts[1])
        ).getTime();
        const now = Date.now();
        return deadline - now;
    };

    // Check warning pengambilan pesanan (25 menit untuk testing)
    const WARNING_THRESHOLD = 25 * 60 * 1000; // 25 menit dalam milidetik

    useEffect(() => {
        if (pesananSiapDiambil.length === 0) return;

        // Cari pesanan yang waktu pengambilannya tinggal <= 25 menit
        const now = Date.now();
        const urgentOrders = pesananSiapDiambil.filter(pesanan => {
            const remaining = getRemainingPickupTime(pesanan.wkt_pengambilan);
            return remaining !== null && remaining > 0 && remaining <= WARNING_THRESHOLD;
        });

        // Filter yang belum di-dismiss
        const ordersToWarn = urgentOrders.filter(
            pesanan => !dismissedWarnings.has(pesanan.id_pesanan)
        );

        if (ordersToWarn.length > 0) {
            const pesanan = ordersToWarn[0];
            const remaining = getRemainingPickupTime(pesanan.wkt_pengambilan);
            const formattedTime = remaining > 60000
                ? `${Math.floor(remaining / 60000)} menit`
                : `${Math.ceil(remaining / 1000)} detik`;

            Swal.fire({
                icon: 'warning',
                title: '⚠️ Peringatan Pengambilan!',
                html: `
                    <div style="text-align: left;">
                        <p style="margin-bottom: 10px;">Pesanan <strong>${pesanan.kode_pesanan}</strong> harus diambil dalam:</p>
                        <div style="background: #fee2e2; padding: 15px; border-radius: 8px; text-align: center; margin: 15px 0;">
                            <span style="font-size: 28px; font-weight: bold; color: #dc2626;">${formattedTime}</span>
                        </div>
                        <p style="color: #666; font-size: 14px;">Segera ambil pesanan Anda sebelum waktu habis!</p>
                    </div>
                `,
                confirmButtonColor: '#dc2626',
                confirmButtonText: 'OK, Saya Mengerti',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: true,
                cancelButtonText: 'Nanti Saja',
                cancelButtonColor: '#6b7280',
            }).then((result) => {
                if (result.isDismissed) {
                    setDismissedWarnings(prev => new Set([...prev, pesanan.id_pesanan]));
                }
            });
        }
    }, [pesananSiapDiambil, dismissedWarnings]);

    const handleAddToCart = (e, item) => {
        e.stopPropagation();
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

    return (
        <AppLayout role="pengguna">
            <div className="bg-gray-100 min-h-screen pb-20">
                {/* BANNER */}
                <div className="px-4 sm:px-6 md:px-10">
                    <div
                        className="h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden flex items-center"
                        style={{
                            backgroundImage: "url('/img/bg2.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="bg-black/30 w-full h-full flex items-center px-6 sm:px-10 md:px-12 text-white">
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                                    Coopify
                                </h1>
                                <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
                                    Belanja cepat & mudah untuk semua kebutuhan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KATEGORI */}
                <div className="px-4 sm:px-6 md:px-10 mt-8 sm:mt-10">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5">Kategori Produk</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/search?kategori=${cat.id}`}
                                className="bg-white p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl flex flex-col items-center shadow hover:-translate-y-2 hover:shadow-xl transition-all"
                            >
                                <div className="text-2xl sm:text-3xl text-blue-600">
                                    {getCategoryIcon(cat.nama)}
                                </div>
                                <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center">{cat.nama}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* PRODUK */}
                <div className="px-4 sm:px-6 md:px-10 mt-8 sm:mt-10">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5">Produk Terbaru</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        {products
                            .map((item) => (
                            <div
                                key={item.id_produk}
                                onClick={() => navigate(`/detail-produk/${item.id_produk}`)}
                                className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer flex flex-col"
                            >
                                <div className="relative bg-gray-50 rounded-xl h-28 sm:h-36 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={
                                            item.gambar && item.gambar.length > 0
                                                ? `${API_BASE_URL}/storage/${item.gambar[0].url_gambar}`
                                                : "/img/default.png"
                                        }
                                        alt={item.nama_produk}
                                        className="h-20 sm:h-28 object-contain mx-auto"
                                    />
                                </div>

                                <div className="mt-2 sm:mt-3 flex flex-col flex-grow">
                                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5em] mb-1">
                                        {item.nama_produk}
                                    </h3>

                                    {item.diskon ? (
                                        <>
                                            <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                                                Rp {Number(item.harga_jual).toLocaleString("id-ID")}
                                            </p>
                                            <p className="text-xs sm:text-base font-bold text-[#1297C9]">
                                                Rp {Number(item.harga_setelah_diskon).toLocaleString("id-ID")}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-xs sm:text-base font-bold text-[#1297C9]">
                                                Rp {Number(item.harga_jual).toLocaleString("id-ID")}
                                            </p>
                                            <div className="h-[1.1rem]"></div>
                                        </>
                                    )}

                                    <p className="text-[10px] sm:text-xs font-semibold text-green-600 mt-auto">
                                        Stok: {item.stok} tersedia
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => handleAddToCart(e, item)}
                                    disabled={loadingCart === item.id_produk}
                                    className="mt-2 sm:mt-3 w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all bg-[#1766D3] text-white shadow-sm hover:bg-[#3D8FFF] active:scale-[0.98]"
                                >
                                    <FaShoppingCart size={10} className="sm:w-3 sm:h-3" />
                                    {loadingCart === item.id_produk ? "..." : "Tambah"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {products.filter(item => item.stok > 0).length > 0 && (
                        <div className="text-center text-sm text-gray-500 mt-4">
                            Menampilkan {products.filter(item => item.stok > 0).length} produk terbaru
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
