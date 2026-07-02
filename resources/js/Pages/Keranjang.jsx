import React, { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useCart } from "../context/CartContext";
import { useSimpleToast, SimpleToastContainer } from "../components/SimpleToast";
import {
    FaTrash,
    FaShoppingBag,
    FaClock,
    FaChevronRight,
    FaChevronLeft,
    FaCheck,
    FaExclamationTriangle,
} from "react-icons/fa";

function toDateTimeInputValue(date) {
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Hitung minimal 30 menit dari sekarang
function getMinPickupTime() {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    return toDateTimeInputValue(date);
}

// Validasi waktu pickup - pastikan tidak kurang dari 30 menit
function validatePickupTime(value) {
    if (!value) return null;
    const selected = new Date(value);
    const minTime = new Date();
    minTime.setMinutes(minTime.getMinutes() + 30);

    // Jika waktu yang dipilih kurang dari minimal, return null untuk reset
    if (selected < minTime) {
        return null;
    }
    return value;
}

export default function Keranjang() {
    const navigate = useNavigate();
    const { fetchCartCount } = useCart();
    const { toast, toasts, setToasts } = useSimpleToast();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pickupTime, setPickupTime] = useState(() => {
        return getMinPickupTime();
    });
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchKeranjang();
    }, []);

    const fetchKeranjang = async () => {
        try {
            const res = await axios.get("/api/keranjang", {
                withCredentials: true,
            });
            setItems(res.data.map((item) => ({ ...item, checked: true })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = (id) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id_keranjang === id
                    ? { ...item, checked: !item.checked }
                    : item,
            ),
        );
    };

    const toggleAll = (checked) => {
        setItems((prev) => prev.map((item) => ({ ...item, checked })));
    };

    const allChecked = items.length > 0 && items.every((item) => item.checked);
    const noneChecked = items.every((item) => !item.checked);
    const checkedItems = items.filter((item) => item.checked);

    const totalItems = checkedItems.reduce(
        (sum, item) => sum + item.jml_dikeranjang,
        0,
    );

    const totalPrice = checkedItems.reduce(
        (sum, item) => sum + Number(item.produk.harga_jual) * item.jml_dikeranjang,
        0,
    );

    const subtotalPerItem = (item) =>
        Number(item.produk.harga_jual) * item.jml_dikeranjang;

    const updateQty = async (idKeranjang, qty, maxStok) => {
        // Validasi: qty minimal 1 dan maksimal sesuai stok
        if (qty < 1 || qty > maxStok) return;

        setUpdatingId(idKeranjang);

        try {
            await axios.put(
                `/api/keranjang/${idKeranjang}`,
                { jumlah: qty },
                { withCredentials: true },
            );
            // Update local state instead of refetching
            setItems((prev) =>
                prev.map((item) =>
                    item.id_keranjang === idKeranjang
                        ? { ...item, jml_dikeranjang: qty }
                        : item
                )
            );
            fetchCartCount();
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    const hapusItem = async (idKeranjang) => {
        try {
            const result = await axios.delete(`/api/keranjang/${idKeranjang}`, {
                withCredentials: true,
            });
            setItems((prev) =>
                prev.filter((item) => item.id_keranjang !== idKeranjang),
            );
            fetchCartCount(); // Update badge counter
        } catch (err) {
            console.error(err);
        }
    };

    const checkout = async () => {
        if (checkedItems.length === 0) return;
        if (!pickupTime) {
            toast.warning("Pilih waktu pengambilan terlebih dahulu");
            return;
        }

        try {
            const res = await axios.post(
                "/api/checkout",
                {
                    items: checkedItems.map((item) => item.id_keranjang),
                    wkt_pengambilan: pickupTime,
                },
                { withCredentials: true },
            );
            navigate(`/pembayaran?pesanan=${res.data.id_pesanan}`, {
                state: {
                    id_pesanan: res.data.id_pesanan,
                    kode_pesanan: res.data.kode_pesanan,
                    total: res.data.total_harga ?? totalPrice,
                    wkt_pengambilan: res.data.wkt_pengambilan,
                },
            });
            fetchCartCount();
        } catch (err) {
            toast.error(err.response?.data?.message || "Checkout gagal");
        }
    };

    const formatRupiah = (angka) =>
        "Rp " + Number(angka).toLocaleString("id-ID");

    // Loading skeleton
    if (loading) {
        return (
            <AppLayout showFooter={false}>
                <div className="max-w-6xl mx-auto p-6">
                    <div className="h-10 w-48 bg-gray-200 rounded-xl mb-8 animate-pulse" />
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-5 shadow-sm animate-pulse"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 bg-gray-200 rounded-xl" />
                                        <div className="flex-1 space-y-3">
                                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                                            <div className="h-10 bg-gray-200 rounded-lg w-32" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm h-64 animate-pulse" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Empty state
    if (items.length === 0) {
        return (
            <AppLayout showFooter={false}>
                <div className="min-h-screen flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaShoppingBag className="text-5xl text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Keranjang Kosong
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Sepertinya kamu belum menambahkan barang apapun.
                            Yuk mulai belanja!
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="inline-flex items-center gap-2 bg-[#1766D3] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3D8FFF] transition-all active:scale-95 shadow-lg shadow-blue-200"
                        >
                            Mulai Belanja
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout showFooter={false}>
            <div className="min-h-screen bg-gray-50 pb-36 sm:pb-32 md:pb-8">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="text-[#1766D3] p-1 sm:p-0"
                                >
                                    <FaChevronLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                                        Keranjang Belanja
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0 sm:mt-1">
                                        {items.length} produk dalam keranjang
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/")}
                                className="text-[#1766D3] font-medium hover:underline flex items-center gap-1 text-sm"
                            >
                                + Tambah
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {/* Select All Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 select-none">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                            allChecked
                                                ? "bg-[#1766D3] border-[#1766D3]"
                                                : "border-gray-300 group-hover:border-[#1766D3]"
                                        }`}
                                    >
                                        {allChecked && (
                                            <FaCheck className="text-white text-xs" />
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        onChange={(e) =>
                                            toggleAll(e.target.checked)
                                        }
                                        className="sr-only"
                                    />
                                    <span className="font-medium text-gray-800">
                                        Pilih Semua ({items.length} produk)
                                    </span>
                                </label>
                            </div>

                            {/* Item Cards */}
                            {items.map((item) => (
                                <div
                                    key={item.id_keranjang}
                                    className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border transition-all ${
                                        item.checked
                                            ? "border-gray-100"
                                            : "border-gray-200 opacity-60"
                                    }`}
                                >
                                    <div className="p-3 sm:p-5">
                                        <div className="flex gap-3">
                                            {/* Checkbox */}
                                            <div
                                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all self-start mt-1 sm:mt-2 ${
                                                    item.checked
                                                        ? "bg-[#1766D3] border-[#1766D3]"
                                                        : "border-gray-300 hover:border-[#1766D3]"
                                                }`}
                                                onClick={() =>
                                                    toggleItem(item.id_keranjang)
                                                }
                                            >
                                                {item.checked && (
                                                    <FaCheck className="text-white text-xs" />
                                                )}
                                            </div>

                                            {/* Product Image */}
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={
                                                        item.produk?.gambar
                                                            ?.length
                                                            ? `${API_BASE_URL}/storage/${item.produk.gambar[0].url_gambar}`
                                                            : "/img/no-image.png"
                                                    }
                                                    alt={item.produk.nama_produk}
                                                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg sm:rounded-xl border border-gray-100"
                                                />
                                                {!item.checked && (
                                                    <div className="absolute inset-0 bg-white/60 rounded-lg sm:rounded-xl" />
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                                            {
                                                                item.produk
                                                                    .nama_produk
                                                            }
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-gray-500 mt-0 sm:mt-1">
                                                            {formatRupiah(
                                                                item.produk
                                                                    .harga_jual,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            hapusItem(
                                                                item.id_keranjang,
                                                            )
                                                        }
                                                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                        title="Hapus"
                                                    >
                                                        <FaTrash size={14} className="sm:w-4 sm:h-4" />
                                                    </button>
                                                </div>

                                                {/* Quantity & Subtotal */}
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-2 sm:gap-0">
                                                    {/* Quantity Controls */}
                                                    <div
                                                        className="flex items-center bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 select-none"
                                                        onClick={(e) => e.stopPropagation()}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                                                            disabled={item.jml_dikeranjang <= 1}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                updateQty(item.id_keranjang, item.jml_dikeranjang - 1, item.produk.stok);
                                                            }}
                                                        >
                                                            <span className="select-none">−</span>
                                                        </button>
                                                        <span className="w-8 sm:w-12 text-center font-semibold text-sm sm:text-base">
                                                            {item.jml_dikeranjang}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                                                            disabled={item.jml_dikeranjang >= item.produk.stok}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                if (item.jml_dikeranjang < item.produk.stok) {
                                                                    updateQty(item.id_keranjang, item.jml_dikeranjang + 1, item.produk.stok);
                                                                }
                                                            }}
                                                        >
                                                            <span className="select-none">+</span>
                                                        </button>
                                                    </div>

                                                    {/* Stock Info */}
                                                    <p className="text-xs text-gray-400">
                                                        Stok: {item.produk.stok}
                                                    </p>

                                                    {/* Subtotal */}
                                                    <div className="text-right w-full sm:w-auto sm:mt-0">
                                                        <p className="text-base sm:text-lg font-bold text-[#1766D3]">
                                                            {formatRupiah(
                                                                subtotalPerItem(
                                                                    item,
                                                                ),
                                                            )}
                                                        </p>
                                                        {item.jml_dikeranjang >
                                                            1 && (
                                                            <p className="text-xs text-gray-400 hidden sm:block">
                                                                {formatRupiah(
                                                                    item.produk
                                                                        .harga_jual,
                                                                )}{" "}
                                                                ×{" "}
                                                                {
                                                                    item.jml_dikeranjang
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary - Mobile: Bottom sticky, Desktop: Side panel */}
                        <div className="lg:col-span-1 order-first lg:order-last">
                            {/* Desktop Summary Card */}
                            <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                                <h2 className="font-bold text-lg text-gray-900 mb-5">
                                    Ringkasan Belanja
                                </h2>

                                {/* Summary Stats */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Total Item</span>
                                        <span className="font-semibold">
                                            {totalItems} unit
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Produk Dipilih</span>
                                        <span className="font-semibold">
                                            {checkedItems.length}
                                        </span>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            Total
                                        </span>
                                        <span className="text-xl font-bold text-[#1766D3]">
                                            {formatRupiah(totalPrice)}
                                        </span>
                                    </div>
                                </div>

                                {/* Pickup Time */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <FaClock className="text-[#1766D3]" />
                                        Waktu Pengambilan
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={pickupTime}
                                        min={getMinPickupTime()}
                                        onChange={(e) => {
                                            const validated = validatePickupTime(e.target.value);
                                            if (validated) {
                                                setPickupTime(validated);
                                            } else {
                                                // Jika tidak valid, reset ke minimal
                                                setPickupTime(getMinPickupTime());
                                            }
                                        }}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1766D3] focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">
                                        Min. 30 menit dari sekarang
                                    </p>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={checkout}
                                    disabled={
                                        checkedItems.length === 0 || !pickupTime
                                    }
                                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                                        checkedItems.length === 0
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-gradient-to-r from-[#1766D3] to-[#3D8FFF] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                    }`}
                                >
                                    Checkout
                                    {checkedItems.length > 0 && (
                                        <FaChevronRight />
                                    )}
                                </button>

                                {/* Warning */}
                                {checkedItems.length === 0 && (
                                    <div className="flex items-center gap-2 mt-4 text-amber-600 text-sm">
                                        <FaExclamationTriangle />
                                        <span>
                                            Pilih minimal 1 produk untuk checkout
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Summary - Bottom Sticky */}
                            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                                {/* Mobile Summary Toggle */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Total:</span>
                                        <span className="text-lg font-bold text-[#1766D3]">
                                            {formatRupiah(totalPrice)}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {checkedItems.length} produk dipilih
                                    </span>
                                </div>

                                {/* Mobile Pickup Time */}
                                <input
                                    type="datetime-local"
                                    value={pickupTime}
                                    min={getMinPickupTime()}
                                    onChange={(e) => {
                                        const validated = validatePickupTime(e.target.value);
                                        if (validated) {
                                            setPickupTime(validated);
                                        } else {
                                            setPickupTime(getMinPickupTime());
                                        }
                                    }}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1766D3] mb-2 bg-gray-50"
                                />

                                {/* Mobile Checkout Button */}
                                <button
                                    onClick={checkout}
                                    disabled={checkedItems.length === 0 || !pickupTime}
                                    className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                                        checkedItems.length === 0
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-gradient-to-r from-[#1766D3] to-[#3D8FFF]"
                                    }`}
                                >
                                    Checkout
                                    {checkedItems.length > 0 && (
                                        <FaChevronRight />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SimpleToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
        </AppLayout>
    );
}
