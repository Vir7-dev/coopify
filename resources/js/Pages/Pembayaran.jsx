import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import { router } from "@inertiajs/react";

export default function Pembayaran({ total = 19000000, metode = "QRIS", pesanan_id, snap_token: initialToken }) {
    const [seconds, setSeconds] = useState(599);
    const [snapToken, setSnapToken] = useState(initialToken || null);
    const [status, setStatus] = useState("idle"); // idle | loading | waiting | paid | failed

    // Countdown
    useEffect(() => {
        if (seconds <= 0 || status === "paid") return;
        const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
        return () => clearInterval(interval);
    }, [seconds, status]);

    // Load Snap.js sekali
    useEffect(() => {
        const script = document.createElement("script");
        script.src = import.meta.env.VITE_MIDTRANS_SNAP_URL || "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    const bayar = async () => {
        setStatus("loading");

        let token = snapToken;

        // Kalau belum ada token, minta ke backend
        if (!token) {
            const res = await fetch("/pembayaran/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ pesanan_id }),
            });
            const data = await res.json();
            token = data.snap_token;
            setSnapToken(token);
        }

        // Buka popup Snap Midtrans
        window.snap.pay(token, {
            onSuccess: () => {
                setStatus("paid");
                // Redirect ke halaman sukses setelah 1.5 detik
                setTimeout(() => router.visit("/"), 1500);
            },
            onPending: () => setStatus("waiting"),
            onError: () => setStatus("failed"),
            onClose: () => setStatus("idle"),
        });
    };

    const menit = String(Math.floor(seconds / 60)).padStart(2, "0");
    const detik = String(seconds % 60).padStart(2, "0");
    const isUrgent = seconds <= 120;
    const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

    return (
        <AppLayout showNavbar={false}>
            <div className="w-full min-h-[calc(100vh-6rem)] flex flex-col">
                {/* ... header yang sama ... */}

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-lg">
                        <div className="bg-gray-800 rounded-2xl overflow-hidden">
                            {/* TOP */}
                            <div className={`px-5 py-4 flex items-center justify-between ${isUrgent ? "bg-red-700" : "bg-emerald-600"}`}>
                                <div>
                                    <p className="text-xs text-white/70 mb-1">Total tagihan</p>
                                    <p className="text-2xl font-semibold text-white">{fmt(total)}</p>
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
                            <div className="px-5 py-6 flex flex-col items-center gap-4">
                                {status === "paid" && (
                                    <div className="text-emerald-400 text-center">
                                        <p className="text-2xl font-bold">✓ Pembayaran Berhasil!</p>
                                        <p className="text-sm text-gray-400 mt-1">Mengalihkan...</p>
                                    </div>
                                )}

                                {status === "failed" && (
                                    <p className="text-red-400 text-sm">Pembayaran gagal. Silakan coba lagi.</p>
                                )}

                                {status !== "paid" && (
                                    <button
                                        onClick={bayar}
                                        disabled={status === "loading" || seconds <= 0}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                                    >
                                        {status === "loading" ? "Memuat..." : "Bayar Sekarang"}
                                    </button>
                                )}

                                <p className="text-xs text-gray-500">
                                    Klik tombol di atas → Popup QRIS Midtrans akan terbuka
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}