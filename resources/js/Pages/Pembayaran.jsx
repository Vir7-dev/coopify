import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "../Layouts/AppLayout";
import api from "../api";

const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 30;
const SNAP_SCRIPT_ID = "midtrans-snap-js";

function getRemainingSeconds(batasWktPem, serverTime, clockOffset = null) {
    if (!batasWktPem) return 0;

    const deadline = new Date(batasWktPem).getTime();
    const offset =
        clockOffset ??
        (serverTime ? new Date(serverTime).getTime() - Date.now() : 0);

    return Math.max(
        0,
        Math.floor((deadline - (Date.now() + offset)) / 1000),
    );
}

function loadSnapScript() {
    if (window.snap) return;

    const snapUrl =
        import.meta.env.VITE_MIDTRANS_SNAP_URL ||
        "https://app.sandbox.midtrans.com/snap/snap.js";

    if (document.getElementById(SNAP_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SNAP_SCRIPT_ID;
    script.src = snapUrl;
    script.setAttribute(
        "data-client-key",
        import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "",
    );
    script.async = true;
    document.body.appendChild(script);
}

export default function Pembayaran({
    total: propTotal,
    metode: propMetode = "QRIS",
    pesanan_id,
    snap_token: initialToken,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const state = location.state || {};
    const pollingRef = useRef(false);
    const clockOffsetRef = useRef(0);

    const queryPesananId = searchParams.get("pesanan");
    const resolvedPesananId =
        pesanan_id ||
        (queryPesananId ? Number(queryPesananId) : null) ||
        state.id_pesanan ||
        state.pesanan_id;

    const [pesananId, setPesananId] = useState(resolvedPesananId || null);
    const [kodePesanan, setKodePesanan] = useState(state.kode_pesanan || "-");
    const [total, setTotal] = useState(Number(propTotal ?? state.total ?? 0));
    const [metode, setMetode] = useState(propMetode);
    const [seconds, setSeconds] = useState(0);
    const [paymentDeadline, setPaymentDeadline] = useState(null);
    const [snapToken, setSnapToken] = useState(initialToken || null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    const applyPaymentStatus = useCallback((paymentStatus) => {
        if (paymentStatus === "lunas") {
            setStatus("paid");
            setTimeout(() => navigate("/profil-pengguna"), 1500);
            return true;
        }

        if (paymentStatus === "gagal") {
            setStatus("failed");
            setError("Pembayaran gagal. Silakan coba lagi.");
            return true;
        }

        if (paymentStatus === "kadaluarsa") {
            setStatus("failed");
            setError("Pembayaran sudah kadaluarsa.");
            return true;
        }

        return false;
    }, [navigate]);

    const fetchPaymentData = useCallback(async (orderId) => {
        const res = await api.get(`/pembayaran/${orderId}`);
        const data = res.data;

        setPesananId(data.pesanan_id);
        setKodePesanan(data.kode_pesanan || "-");
        setTotal(Number(data.total ?? 0));
        setMetode(data.metode || "QRIS");

        if (data.snap_token) {
            setSnapToken(data.snap_token);
        }

        if (data.batas_wkt_pem) {
            setPaymentDeadline(data.batas_wkt_pem);
        }

        if (data.server_time) {
            clockOffsetRef.current =
                new Date(data.server_time).getTime() - Date.now();
        }

        setSeconds(getRemainingSeconds(data.batas_wkt_pem, data.server_time));

        return data;
    }, []);

    const pollPaymentStatus = useCallback(async (orderId) => {
        if (pollingRef.current) return;
        pollingRef.current = true;

        setStatus("confirming");
        setError(null);

        try {
            for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
                const data = await fetchPaymentData(orderId);

                if (applyPaymentStatus(data.status_pembayaran)) {
                    return;
                }

                if (attempt < POLL_MAX_ATTEMPTS - 1) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, POLL_INTERVAL_MS),
                    );
                }
            }

            setStatus("waiting");
            setError(
                "Konfirmasi masih diproses. Silakan cek status pesanan di profil nanti.",
            );
        } catch (err) {
            setStatus("failed");
            setError(
                err.response?.data?.message ||
                    "Gagal memverifikasi status pembayaran.",
            );
        } finally {
            pollingRef.current = false;
        }
    }, [applyPaymentStatus, fetchPaymentData]);

    useEffect(() => {
        if (!resolvedPesananId) {
            setPageLoading(false);
            setStatus("failed");
            setError("Data pesanan tidak ditemukan.");
            return;
        }

        let cancelled = false;

        const loadPayment = async () => {
            setPageLoading(true);
            setError(null);

            try {
                const data = await fetchPaymentData(resolvedPesananId);

                if (cancelled) return;

                if (applyPaymentStatus(data.status_pembayaran)) {
                    return;
                }

                if (data.status_pembayaran === "menunggu") {
                    setStatus("idle");
                }
            } catch (err) {
                if (cancelled) return;

                setStatus("failed");
                setError(
                    err.response?.data?.message ||
                        "Gagal memuat data pembayaran.",
                );
            } finally {
                if (!cancelled) {
                    setPageLoading(false);
                }
            }
        };

        loadPayment();

        return () => {
            cancelled = true;
        };
    }, [resolvedPesananId, applyPaymentStatus, fetchPaymentData]);

    useEffect(() => {
        if (status === "paid" || !paymentDeadline) {
            return;
        }

        const tick = () => {
            setSeconds(
                getRemainingSeconds(
                    paymentDeadline,
                    null,
                    clockOffsetRef.current,
                ),
            );
        };

        tick();
        const interval = setInterval(tick, 1000);

        return () => clearInterval(interval);
    }, [paymentDeadline, status]);

    useEffect(() => {
        loadSnapScript();
    }, []);

    const bayar = async () => {
        if (!pesananId) {
            setStatus("failed");
            setError("Data pesanan tidak ditemukan.");
            return;
        }

        setStatus("loading");
        setError(null);

        let token = snapToken;

        try {
            if (!token) {
                const res = await api.post("/pembayaran/create", {
                    id_pesanan: pesananId,
                });

                token = res.data.snap_token;
                setSnapToken(token);
            }
        } catch (err) {
            setStatus("failed");
            setError(
                err.response?.data?.message || "Gagal membuat transaksi.",
            );
            return;
        }

        if (!window.snap) {
            setStatus("failed");
            setError("Midtrans Snap belum siap. Coba beberapa detik lagi.");
            return;
        }

        window.snap.pay(token, {
            onSuccess: () => pollPaymentStatus(pesananId),
            onPending: () => pollPaymentStatus(pesananId),
            onError: () => {
                setStatus("failed");
                setError("Pembayaran gagal. Silakan coba lagi.");
            },
            onClose: () => {
                if (!pollingRef.current) {
                    setStatus("idle");
                }
            },
        });
    };

    const menit = String(Math.floor(seconds / 60)).padStart(2, "0");
    const detik = String(seconds % 60).padStart(2, "0");
    const isUrgent = seconds <= 120;
    const fmt = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

    if (pageLoading) {
        return (
            <AppLayout showNavbar={false}>
                <div className="w-full min-h-[calc(100vh-6rem)] flex items-center justify-center">
                    <p className="text-gray-500">Memuat data pembayaran...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout showNavbar={false}>
            <div className="w-full min-h-[calc(100vh-6rem)] flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-lg">
                        <div className="bg-gray-800 rounded-2xl overflow-hidden">
                            <div
                                className={`px-5 py-4 flex items-center justify-between ${
                                    isUrgent ? "bg-red-700" : "bg-emerald-600"
                                }`}
                            >
                                <div>
                                    <p className="text-xs text-white/70 mb-1">
                                        Total tagihan
                                    </p>
                                    <p className="text-2xl font-semibold text-white">
                                        {fmt(total)}
                                    </p>
                                    <p className="text-xs text-white/70 mt-1">
                                        {kodePesanan} - {metode}
                                    </p>
                                </div>

                                <div
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 ${
                                        isUrgent
                                            ? "bg-red-900/40"
                                            : "bg-white/15"
                                    }`}
                                >
                                    <div>
                                        <p className="text-xs text-white/70">
                                            Batas waktu
                                        </p>
                                        <p className="text-xl font-semibold text-white tabular-nums">
                                            {menit}:{detik}
                                        </p>
                                    </div>
                                    <span
                                        className={`w-2 h-2 rounded-full animate-pulse ${
                                            isUrgent
                                                ? "bg-red-300"
                                                : "bg-emerald-200"
                                        }`}
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-6 flex flex-col items-center gap-4">
                                {status === "paid" && (
                                    <div className="text-emerald-400 text-center">
                                        <p className="text-2xl font-bold">
                                            Pembayaran berhasil!
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Mengalihkan...
                                        </p>
                                    </div>
                                )}

                                {status === "confirming" && (
                                    <p className="text-yellow-300 text-sm text-center">
                                        Memverifikasi pembayaran...
                                    </p>
                                )}

                                {status === "waiting" && (
                                    <p className="text-yellow-300 text-sm text-center">
                                        {error ||
                                            "Pembayaran sedang menunggu konfirmasi."}
                                    </p>
                                )}

                                {status === "failed" && (
                                    <p className="text-red-400 text-sm text-center">
                                        {error ||
                                            "Pembayaran gagal. Silakan coba lagi."}
                                    </p>
                                )}

                                {seconds <= 0 &&
                                    status !== "paid" &&
                                    status !== "confirming" &&
                                    status !== "failed" && (
                                        <p className="text-red-400 text-sm text-center">
                                            Batas waktu pembayaran telah habis.
                                        </p>
                                    )}

                                {status !== "paid" &&
                                    status !== "confirming" && (
                                        <button
                                            onClick={bayar}
                                            disabled={
                                                status === "loading" ||
                                                seconds <= 0 ||
                                                !pesananId
                                            }
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                                        >
                                            {status === "loading"
                                                ? "Memuat..."
                                                : "Bayar Sekarang"}
                                        </button>
                                    )}

                                {status === "confirming" && (
                                    <div className="w-full flex justify-center py-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 text-center">
                                    Klik tombol di atas untuk membuka popup QRIS
                                    Midtrans
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
