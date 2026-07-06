import React, { useRef, useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import api from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import {
    ShoppingBasket,
    Users,
    BanknoteArrowUp,
    NotepadText,
    FileDown,
    ChevronDown,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardAdmin = () => {
    const chartRef = useRef();

    const [month, setMonth] = useState("Januari");
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [week, setWeek] = useState(null); // null = semua minggu
    const [totalWeeks, setTotalWeeks] = useState(5); // default 5

    const [openMonth, setOpenMonth] = useState(false);
    const [openYear, setOpenYear] = useState(false);

    // State untuk data statistik
    const [stats, setStats] = useState({
        total_produk: 0,
        total_kategori: 0,
        total_pemasukan: 0,
        total_transaksi: 0,
    });

    // State untuk data chart
    const [chartData, setChartData] = useState({
        labels: [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
        ],
        datasets: [
            {
                label: "Penjualan",
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: "#1766D3",
                borderRadius: 8,
            },
        ],
    });

    const [loading, setLoading] = useState(true);

    // Konversi nama bulan Indonesia ke nomor
    const bulanKeNomor = {
        Januari: "01",
        Februari: "02",
        Maret: "03",
        April: "04",
        Mei: "05",
        Juni: "06",
        Juli: "07",
        Agustus: "08",
        September: "09",
        Oktober: "10",
        November: "11",
        Desember: "12",
    };

    // Fetch data statistik dan chart
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch statistik umum (produk & kategori) dari profil endpoint
            const profilRes = await api.get("/admin/profil");
            const statistikProfil = profilRes.data.statistik || {};

            // Fetch chart yang juga mengembalikan statistik berdasarkan bulan
            const bulanNomor = bulanKeNomor[month] || "01";
            const weekParam = week ? `&minggu=${week}` : '';
            const chartRes = await api.get(`/admin/chart?bulan=${bulanNomor}&tahun=${year}${weekParam}`);
            const statistikChart = chartRes.data.statistik || {};

            // Set stats dengan data yang sesuai
            setStats({
                total_produk: statistikProfil.total_produk || 0,
                total_kategori: statistikProfil.total_kategori || 0,
                total_pemasukan: statistikChart.total_pemasukan || 0,
                total_transaksi: statistikChart.total_transaksi || 0,
            });

            // Set chart data
            setChartData({
                labels: chartRes.data.labels || [
                    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
                ],
                datasets: [{
                    label: "Penjualan",
                    data: chartRes.data.datasets?.[0]?.data || [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "#1766D3",
                    borderRadius: 8,
                }],
            });

            // Set jumlah minggu
            setTotalWeeks(chartRes.data.jumlah_minggu || 5);

            // Fetch pesanan berdasarkan bulan, tahun, dan minggu
            const pesananRes = await api.get(`/admin/pesanan?bulan=${bulanNomor}&tahun=${year}&selesai=true${weekParam}`);
            setPesanan(pesananRes.data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchChartData = async () => {
        try {
            const bulanNomor = bulanKeNomor[month] || "01";
            const weekParam = week ? `&minggu=${week}` : '';
            const chartRes = await api.get(`/admin/chart?bulan=${bulanNomor}&tahun=${year}${weekParam}`);
            const data = chartRes.data;

            setChartData({
                labels: data.labels || [
                    "Minggu",
                    "Senin",
                    "Selasa",
                    "Rabu",
                    "Kamis",
                    "Jumat",
                    "Sabtu",
                ],
                datasets: [
                    {
                        label: "Penjualan",
                        data: data.datasets?.[0]?.data || [0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: "#1766D3",
                        borderRadius: 8,
                    },
                ],
            });
        } catch (err) {
            console.error("Error fetching chart data:", err);
        }
    };

    const handleMonthChange = (newMonth) => {
        setMonth(newMonth);
        setWeek(null); // Reset ke semua minggu
        setOpenMonth(false);
        // Delay fetch agar state terupdate dulu
        setTimeout(() => {
            const bulanNomor = bulanKeNomor[newMonth] || "01";
            fetchPesananFiltered(bulanNomor, year, null);
            fetchChartDataFiltered(newMonth, year, null);
        }, 0);
    };

    const handleYearChange = (newYear) => {
        setYear(newYear);
        setWeek(null); // Reset ke semua minggu
        setOpenYear(false);
        // Delay fetch agar state terupdate dulu
        setTimeout(() => {
            fetchPesananFiltered(bulanKeNomor[month] || "01", newYear, null);
            fetchChartDataFiltered(month, newYear, null);
        }, 0);
    };

    // Navigate to previous week
    const handlePrevWeek = () => {
        setWeek(currentWeek => {
            let newWeek;
            if (currentWeek === null) {
                // Jika sedang lihat semua minggu, ke minggu terakhir
                newWeek = totalWeeks;
            } else if (currentWeek > 1) {
                newWeek = currentWeek - 1;
            } else {
                return currentWeek;
            }
            // Fetch data dengan minggu baru
            setTimeout(() => {
                fetchPesananFiltered(bulanKeNomor[month] || "01", year, newWeek);
                fetchChartDataFiltered(month, year, newWeek);
            }, 0);
            return newWeek;
        });
    };

    // Navigate to next week
    const handleNextWeek = () => {
        setWeek(currentWeek => {
            let newWeek;
            if (currentWeek === null) {
                // Jika sedang lihat semua minggu, tidak perlu next
                return currentWeek;
            } else if (currentWeek < totalWeeks) {
                newWeek = currentWeek + 1;
            } else {
                return currentWeek;
            }
            // Fetch data dengan minggu baru
            setTimeout(() => {
                fetchPesananFiltered(bulanKeNomor[month] || "01", year, newWeek);
                fetchChartDataFiltered(month, year, newWeek);
            }, 0);
            return newWeek;
        });
    };

    // Fetch pesanan dengan filter
    const fetchPesananFiltered = async (bulan, tahun, minggu) => {
        try {
            const weekParam = minggu ? `&minggu=${minggu}` : '';
            const pesananRes = await api.get(`/admin/pesanan?bulan=${bulan}&tahun=${tahun}&selesai=true${weekParam}`);
            setPesanan(pesananRes.data);
        } catch (err) {
            console.error("Error fetching pesanan:", err);
        }
    };

    // Fetch chart dengan filter
    const fetchChartDataFiltered = async (bulanNama, tahun, minggu) => {
        try {
            const bulanNomor = bulanKeNomor[bulanNama] || "01";
            const weekParam = minggu ? `&minggu=${minggu}` : '';
            const chartRes = await api.get(`/admin/chart?bulan=${bulanNomor}&tahun=${tahun}${weekParam}`);
            const data = chartRes.data;

            setChartData({
                labels: data.labels || [
                    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
                ],
                datasets: [{
                    label: "Penjualan",
                    data: data.datasets?.[0]?.data || [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "#1766D3",
                    borderRadius: 8,
                }],
            });

            // Update statistik dan jumlah minggu berdasarkan bulan yang dipilih
            if (data.statistik) {
                setStats(prev => ({
                    ...prev,
                    total_pemasukan: data.statistik.total_pemasukan || 0,
                    total_transaksi: data.statistik.total_transaksi || 0,
                }));
            }

            if (data.jumlah_minggu) {
                setTotalWeeks(data.jumlah_minggu);
            }
        } catch (err) {
            console.error("Error fetching chart data:", err);
        }
    };

    const formatRupiah = (angka) => {
        return "Rp " + Number(angka || 0).toLocaleString("id-ID");
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    const [profil, setProfil] = useState(null);
    const [pesanan, setPesanan] = useState([]);

    useEffect(() => {
        fetchData();

        const fetchProfil = async () => {
            try {
                const res = await api.get("/admin/profil");
                setProfil(res.data.profil);
            } catch (err) {
                console.error("Gagal ambil profil:", err);
            }
        };

        fetchProfil();
    }, []);

    const exportPDF = () => {
        console.log("PROFIL:", profil);
        const pdf = new jsPDF();

        const namaAdmin = profil?.nama || "Admin Koperasi";

        const totalTransaksi = stats.total_transaksi;
        const totalPendapatan = stats.total_pemasukan;

        const tanggalCetak = new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        const nomorUrut = String(stats.total_transaksi + 1).padStart(4, "0");

        const nomorLaporan = `COOP-${year}${bulanKeNomor[month]}-${nomorUrut}`;

        // HEADER
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("KOPERASI COOPIFY", 105, 15, { align: "center" });

        pdf.setFontSize(11);
        pdf.text("LAPORAN PENJUALAN BULANAN", 105, 22, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(`No Laporan : ${nomorLaporan}`, 14, 32);
        pdf.text(`Periode    : ${month} ${year}`, 14, 38);
        pdf.text(`Tanggal Cetak : ${tanggalCetak}`, 14, 44);

        pdf.line(14, 48, 196, 48);

        // RINGKASAN PENJUALAN
        pdf.setFont("helvetica", "bold");
        pdf.text("RINGKASAN", 14, 58);

        pdf.setFont("helvetica", "normal");
        pdf.text(`Total Transaksi      : ${totalTransaksi}`, 14, 66);
        pdf.text(
            `Total Pendapatan     : Rp ${totalPendapatan.toLocaleString("id-ID")}`,
            14,
            72,
        );

        const pesananSelesai = pesanan.filter(
            (item) => item.status_pesanan === "selesai",
        );

        const tableData = pesananSelesai.map((item, index) => [
            index + 1,
            item.kode_pesanan,
            item.pengguna?.nama || "-",
            item.detail_pesanan
                ?.map((d) => `${d.produk?.nama_produk} (${d.jml_peritem}x)`)
                .join("\n"),
            `Rp ${Number(item.total_harga).toLocaleString("id-ID")}`,
            item.status_pesanan,
        ]);

        autoTable(pdf, {
            startY: 82,
            head: [
                [
                    "No",
                    "Kode",
                    "Pelanggan",
                    "Produk",
                    "Total",
                    "Status",
                ],
            ],
            body: tableData,
            styles: {
                fontSize: 8,
                cellPadding: 2,
            },
        });

        // TANDA TANGAN
        const y = pdf.lastAutoTable.finalY + 15;

        pdf.text("Mengetahui,", 150, y);
        pdf.text("Admin Koperasi", 150, y + 8);

        pdf.setFont("helvetica", "bold");
        pdf.text(namaAdmin, 150, y + 30);

        // FOOTER
        pdf.setFontSize(8);
        pdf.setTextColor(120);
        pdf.text(
            "Dokumen ini digenerate otomatis oleh sistem Coopify",
            105,
            285,
            { align: "center" },
        );

        pdf.save(`laporan-${month}-${year}.pdf`);
    };

    const statCards = [
        {
            title: "Total Produk",
            value: stats.total_produk.toString(),
            icon: <ShoppingBasket size={22} className="text-[#1766D3]" />,
        },
        {
            title: "Total Kategori",
            value: stats.total_kategori.toString(),
            icon: <Users size={22} className="text-[#1766D3]" />,
        },
        {
            title: "Total Pemasukan",
            value: formatRupiah(stats.total_pemasukan),
            icon: <BanknoteArrowUp size={22} className="text-[#1766D3]" />,
        },
        {
            title: "Total Transaksi",
            value: stats.total_transaksi.toString(),
            icon: <NotepadText size={22} className="text-[#1766D3]" />,
        },
    ];

    const bulanList = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const tahunList = ["2024", "2025", "2026", "2027", "2028"];

    return (
        <AppLayout role="admin" showFooter={false}>
            <div className="bg-gray-100 min-h-screen space-y-12">
                {/* BANNER */}
                <div className="px-6 md:px-10">
                    <div
                        className="w-full h-[400px] md:h-[500px] flex items-center rounded-2xl overflow-hidden"
                        style={{
                            backgroundImage: "url('/img/bn.admin.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="w-full h-full bg-black/20 flex items-center px-6 md:px-12 text-white">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    Dashboard Admin
                                </h1>
                                <p className="text-sm opacity-90 mt-2">
                                    Pantau penjualan & aktivitas sistem
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STATISTIK */}
                <div className="px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-5">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                              <div
                                  key={i}
                                  className="bg-white rounded-2xl p-4 shadow-sm animate-pulse"
                              >
                                  <div className="flex items-center gap-3">
                                      <div className="bg-gray-200 w-11 h-11 rounded-xl"></div>
                                      <div className="flex-1">
                                          <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                                          <div className="h-5 bg-gray-200 rounded w-16"></div>
                                      </div>
                                  </div>
                              </div>
                          ))
                        : statCards.map((item, i) => (
                              <div
                                  key={i}
                                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex items-center gap-3"
                              >
                                  <div className="bg-blue-50 p-3 rounded-xl flex items-center justify-center">
                                      {item.icon}
                                  </div>

                                  <div>
                                      <p className="text-xs md:text-sm text-gray-500">
                                          {item.title}
                                      </p>
                                      <p className="font-bold text-base md:text-lg">
                                          {item.value}
                                      </p>
                                  </div>
                              </div>
                          ))}
                </div>

                {/* FILTER */}
                <div className="px-6 md:px-10 flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
                    <button
                        onClick={exportPDF}
                        className="bg-red-500 hover:bg-red-600 active:scale-95 text-white px-4 py-2 rounded-lg transition w-full md:w-auto flex items-center gap-2"
                    >
                        <FileDown size={18} />
                        Export PDF
                    </button>

                    {/* DROPDOWN */}
                    <div className="flex gap-3 relative">
                        {/* BULAN */}
                        <div className="relative w-[160px]">
                            <div
                                onClick={() => {
                                    setOpenMonth(!openMonth);
                                    setOpenYear(false);
                                }}
                                className="border border-gray-200 rounded-xl px-4 py-2 bg-white cursor-pointer flex justify-between items-center hover:ring-2 hover:ring-blue-300 transition"
                            >
                                <span>{month}</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-200 ${openMonth ? "rotate-180" : ""}`}
                                />
                            </div>

                            {openMonth && (
                                <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-lg max-h-[180px] overflow-y-auto z-50 border border-gray-100">
                                    {bulanList.map((m) => (
                                        <div
                                            key={m}
                                            onClick={() => handleMonthChange(m)}
                                            className={`px-4 py-2 cursor-pointer text-sm transition
                        ${month === m ? "bg-[#1766D3] text-white" : "hover:bg-blue-50"}
                      `}
                                        >
                                            {m}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* TAHUN */}
                        <div className="relative w-[120px]">
                            <div
                                onClick={() => {
                                    setOpenYear(!openYear);
                                    setOpenMonth(false);
                                }}
                                className="border border-gray-200 rounded-xl px-4 py-2 bg-white cursor-pointer flex justify-between items-center hover:ring-2 hover:ring-blue-300 transition"
                            >
                                <span>{year}</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-200 ${openYear ? "rotate-180" : ""}`}
                                />
                            </div>

                            {openYear && (
                                <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-lg max-h-[180px] overflow-y-auto z-50 border border-gray-100">
                                    {tahunList.map((y) => (
                                        <div
                                            key={y}
                                            onClick={() => handleYearChange(y)}
                                            className={`px-4 py-2 cursor-pointer text-sm transition
                        ${year === y ? "bg-[#1766D3] text-white" : "hover:bg-blue-50"}
                      `}
                                        >
                                            {y}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CHART */}
                <div className="px-6 md:px-10">
                    <div
                        ref={chartRef}
                        className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Grafik Penjualan - {month} {year}
                                {week && ` (Minggu ke-${week})`}
                            </h3>

                            {/* Week Navigation */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevWeek}
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={week === 1}
                                    title={week === null ? "Ke minggu terakhir" : ""}
                                >
                                    ← Prev
                                </button>
                                <span className="text-sm text-gray-500 min-w-[80px] text-center">
                                    {week ? `Minggu ${week}/${totalWeeks}` : `Semua`}
                                </span>
                                <button
                                    onClick={handleNextWeek}
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={week !== null && week >= totalWeeks}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>

                        <div className="h-56">
                            <Bar data={chartData} options={options} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardAdmin;
