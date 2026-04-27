import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { Hamburger, Pill, Shirt, CalendarClock, NotebookPen } from "lucide-react";

const SIZE_PRICES = {
    S:   150000,
    M:   165000,
    L:   180000,
    XL:  220000,
    XXL: 250000,
};

const initialItems = [
    { id: 1, name: "Pringles", category: "Makanan", price: 10000, qty: 1, checked: true, icon: "food", size: null },
    { id: 2, name: "Betadine", category: "Obat", price: 15000, qty: 1, checked: true, icon: "pill", size: null },
    { id: 3, name: "Buku Sidu", category: "Alat Tulis Kantor", price: 5000, qty: 1, checked: true, icon: "note", size: null },
    { id: 4, name: "Almamater", category: "Almamater", price: 150000, baseprice: 150000, size: null, qty: 1, checked: false, icon: "shirt", size: null },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const icons = {
        food: <Hamburger className="w-7 h-7 text-gray-400" />,
        pill: <Pill className="w-7 h-7 text-gray-400" />,
        shirt: <Shirt className="w-7 h-7 text-gray-400" />,
        notepen: <NotebookPen className="w-7 h-7 text-gray-400" />
};

function fmt(n) {
    return "Rp " + n.toLocaleString("id-ID");
}

export default function Keranjang() {
    const [items, setItems] = useState(initialItems);
    const [pickupTime, setPickupTime] = useState("");
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [tempDate, setTempDate] = useState("");
    const [tempTime, setTempTime] = useState("");

    const allChecked = items.every((i) => i.checked);
    const noneChecked = items.every((i) => !i.checked);
    const checkedItems = items.filter((i) => i.checked);
    const total = checkedItems.reduce((s, i) => s + i.price * i.qty, 0);

    // item yang perlu size tapi belum pilih
    const hasUnselectedSize = checkedItems.some((i) => i.category === "Almamater" && !i.size);

    const toggleAll = (val) => setItems(items.map((i) => ({ ...i, checked: val })));
    const toggleItem = (id) => setItems(items.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
    const changeQty = (id, delta) =>
        setItems(items.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
    const changeSize = (id, size) =>
        setItems(items.map((i) => i.id === id ? { ...i, size, price: SIZE_PRICES[size] ?? i.price } : i));

    const confirmPickup = () => {
        if (tempDate && tempTime) {
            const d = new Date(tempDate);
            const label = d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
            setPickupTime(`${label}, ${tempTime}`);
            setShowPickupModal(false);
        }
    };

    return (
        <AppLayout showNavbar={false}>
            <div className="w-full relative">

                {/* PAGE HEADER */}
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 16 16">
                            <path d="M10 4L6 8l4 4" />
                        </svg>
                    </button>
                    <div className="border-l-4 border-[#2D5A74] pl-3">
                        <h1 className="text-xl font-semibold text-gray-800">Keranjang Belanja</h1>
                        <p className="text-sm text-gray-500">{items.length} item di keranjang kamu</p>
                    </div>
                </div>

                {/* MAIN LAYOUT */}
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">

                    {/* LEFT: ITEM LIST */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                            {/* SELECT ALL */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    ref={(el) => { if (el) el.indeterminate = !allChecked && !noneChecked; }}
                                    onChange={(e) => toggleAll(e.target.checked)}
                                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                                />
                                <span className="text-sm text-gray-500">Pilih semua</span>
                            </div>

                            {/* ITEMS */}
                            <div className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <div key={item.id} className="px-4 py-4 hover:bg-gray-50 transition">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={() => toggleItem(item.id)}
                                                className="w-4 h-4 accent-emerald-500 cursor-pointer flex-shrink-0"
                                            />
                                            <div className="w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-50">
                                                {icons[item.icon]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-400 mb-1">{item.category}</p>
                                                <p className="text-sm font-semibold text-emerald-500">{fmt(item.price * item.qty)}</p>
                                            </div>
                                            {/* QTY CONTROL */}
                                            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                                <button
                                                    onClick={() => changeQty(item.id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition text-lg leading-none"
                                                >−</button>
                                                <span className="w-6 text-center text-sm font-medium text-gray-900">{item.qty}</span>
                                                <button
                                                    onClick={() => changeQty(item.id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition text-lg leading-none"
                                                >+</button>
                                            </div>
                                        </div>

                                        {/* SIZE PICKER — hanya muncul kalau Almamater */}
                                        {item.category === "Almamater" && (
                                            <div className="mt-3 ml-[calc(1rem+2.25rem)] flex items-center gap-2 flex-wrap">
                                                <span className="text-xs text-gray-400 mr-1">Ukuran:</span>
                                                {SIZES.map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => changeSize(item.id, s)}
                                                        className={`w-9 h-9 rounded-lg text-xs font-medium border transition
                                                            ${item.size === s
                                                                ? "bg-emerald-500 border-emerald-500 text-white"
                                                                : "bg-white border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-500"
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                                {/* warning kalau item diceklis tapi belum pilih size */}
                                                {item.checked && !item.size && (
                                                    <span className="text-xs text-red-400 ml-1">Pilih ukuran</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: SUMMARY PANEL */}
                    <div className="w-full lg:w-80 flex-shrink-0 sticky top-6 self-start h-[calc(100vh-3rem)]">
                        <div className="bg-[#2D5A74] text-white rounded-xl overflow-hidden flex flex-col h-full">

                            {/* PICKUP */}
                            <div className="px-4 pt-4 pb-3 border-b border-[#1E3F52]">
                                <p className="text-xs text-gray-400 mb-2">Waktu Pengambilan</p>
                                <button
                                    onClick={() => setShowPickupModal(true)}
                                    className="w-full flex items-center gap-3 bg-[#1E3F52] rounded-xl px-3 py-3 hover:bg-[#3A6F8A] transition"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[#3A6F8A]/20 flex items-center justify-center flex-shrink-0">
                                        <CalendarClock className="w-4 h-4 text-[#7DB5CC]" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {pickupTime || "Pilih jadwal pengambilan"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Klik untuk memilih tanggal & waktu</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 16 16">
                                        <path d="M6 4l4 4-4 4" />
                                    </svg>
                                </button>
                            </div>

                            {/* SUMMARY */}
                            <div className="px-4 py-4 space-y-2 flex-1">
                                <div className="flex justify-between text-sm text-[#7DB5CC]">
                                    <span>Subtotal ({checkedItems.length} item)</span>
                                    <span className="text-white">{fmt(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[#7DB5CC]">
                                    <span>Diskon</span>
                                    <span className="text-emerald-400">-Rp 0</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-700">
                                    <span className="text-white">Total</span>
                                    <span className="text-white">{fmt(total)}</span>
                                </div>

                                {/* WARNING size belum dipilih */}
                                {hasUnselectedSize && (
                                    <div className="mt-3 flex items-start gap-2 bg-red-900/30 border border-red-700/40 rounded-xl px-3 py-2.5">
                                        <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" viewBox="0 0 16 16">
                                            <circle cx="8" cy="8" r="6" />
                                            <path d="M8 5v3M8 11h.01" />
                                        </svg>
                                        <p className="text-xs text-red-400 leading-relaxed">
                                            Ada almamater yang belum dipilih ukurannya. Pilih ukuran sebelum checkout.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* CHECKOUT */}
                            <div className="px-4 pb-4 mt-auto">
                                <button
                                    disabled={checkedItems.length === 0 || hasUnselectedSize}
                                    className="w-full py-3 bg-white text-gray-900 font-medium text-sm rounded-xl disabled:bg-gray-600 disabled:text-gray-400 hover:bg-gray-100 transition active:scale-95"
                                >
                                    Checkout ({checkedItems.length} item)
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* PICKUP MODAL */}
                {showPickupModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
                        <div className="w-full md:w-96 bg-white rounded-t-2xl md:rounded-2xl p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Pilih Waktu Pengambilan</h3>
                            <div className="space-y-3 mb-5">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Tanggal</label>
                                    <input
                                        type="date"
                                        value={tempDate}
                                        onChange={(e) => setTempDate(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Jam</label>
                                    <input
                                        type="time"
                                        value={tempTime}
                                        onChange={(e) => setTempTime(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPickupModal(false)}
                                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
                                >Batal</button>
                                <button
                                    onClick={confirmPickup}
                                    disabled={!tempDate || !tempTime}
                                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400 hover:bg-emerald-700 transition"
                                >Konfirmasi</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}