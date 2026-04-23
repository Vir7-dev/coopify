import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";

export default function Pembayaran({ total = 19000000, metode = "QRIS" }) {
    const [seconds, setSeconds] = useState(599);

    useEffect(() => {
        if (seconds <= 0) return;
        const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    const menit = String(Math.floor(seconds / 60)).padStart(2, "0");
    const detik = String(seconds % 60).padStart(2, "0");
    const isUrgent = seconds <= 120;

    const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

    return (
        <AppLayout showNavbar={false}>
            <div className="w-full relative">

                {/* PAGE HEADER */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 transition rounded-xl px-4 py-2"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 16 16">
                            <path d="M10 4L6 8l4 4" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Kembali</span>
                    </button>

                    <h1 className="text-xl font-semibold text-gray-800">Pembayaran</h1>

                    <div className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-xl">
                        {metode}
                    </div>
                </div>

                {/* MAIN CARD */}
                <div className="max-w-md mx-auto">
                    <div className="bg-gray-800 rounded-2xl overflow-hidden">

                        {/* TOP — total & timer */}
                        <div className={`px-5 py-4 flex items-center justify-between transition-colors duration-500 ${isUrgent ? "bg-red-700" : "bg-emerald-600"}`}>
                            <div>
                                <p className="text-xs text-white/70 mb-1">Total tagihan</p>
                                <p className="text-2xl font-semibold text-white tracking-tight">{fmt(total)}</p>
                            </div>
                            <div className={`flex items-center gap-2 rounded-xl px-4 py-2 ${isUrgent ? "bg-red-900/40" : "bg-white/15"}`}>
                                <div>
                                    <p className="text-xs text-white/70">Batas waktu</p>
                                    <p className="text-xl font-semibold text-white tabular-nums">{menit}:{detik}</p>
                                </div>
                                <span className={`w-2 h-2 rounded-full animate-pulse ${isUrgent ? "bg-red-300" : "bg-emerald-200"}`} />
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="px-5 py-4">

                            {/* STATUS */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-sm text-emerald-400 font-medium">Menunggu pembayaran...</span>
                            </div>

                            {/* QR FRAME */}
                            <div className="border border-gray-600 rounded-xl p-4 mb-4 flex flex-col items-center gap-3">
                                {/* QRIS logo */}
                                <div className="flex items-center gap-2 w-full">
                                    <div className="bg-red-600 rounded px-2 py-0.5">
                                        <span className="text-white text-xs font-bold tracking-widest">QRIS</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 leading-tight">QR Code Standar</p>
                                        <p className="text-xs text-gray-400 leading-tight">Pembayaran Nasional</p>
                                    </div>
                                </div>

                                {/* QR placeholder — ganti src dengan QR code asli */}
                                <div className="relative w-52 h-52 bg-white rounded-lg flex items-center justify-center">
                                    {/* Corner accents */}
                                    {["top-2 left-2 border-t-2 border-l-2 rounded-tl", "top-2 right-2 border-t-2 border-r-2 rounded-tr", "bottom-2 left-2 border-b-2 border-l-2 rounded-bl", "bottom-2 right-2 border-b-2 border-r-2 rounded-br"].map((cls, i) => (
                                        <span key={i} className={`absolute w-6 h-6 border-emerald-500 ${cls}`} />
                                    ))}
                                    {/* Ganti ini dengan <img src={qrCodeUrl} /> kalau sudah ada QR dari backend */}
                                    <p className="text-gray-400 text-xs text-center px-4">QR Code akan muncul di sini</p>
                                </div>
                            </div>

                            {/* STEPS */}
                            <div className="space-y-3 mb-4">
                                {[
                                    "Buka aplikasi e-wallet atau mobile banking kamu",
                                    "Pilih menu Scan QR atau Bayar QRIS",
                                    "Arahkan kamera ke QR Code di atas dan konfirmasi pembayaran",
                                ].map((text, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* TRUST */}
                            <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-700">
                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" viewBox="0 0 14 14">
                                    <rect x="2" y="6" width="10" height="7" rx="2" />
                                    <path d="M4.5 6V4a2.5 2.5 0 015 0v2" />
                                </svg>
                                <span className="text-xs text-gray-400 font-medium">Transaksi aman & Terenkripsi</span>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}