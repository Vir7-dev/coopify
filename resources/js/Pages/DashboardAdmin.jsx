import React, { useRef, useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import api from "../api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ShoppingBasket, Users, BanknoteArrowUp, NotepadText } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardAdmin = () => {

  const chartRef = useRef();

  const [month, setMonth] = useState("Januari");
  const [year, setYear] = useState(new Date().getFullYear().toString());

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
    labels: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    datasets: [
      {
        label: "Penjualan",
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#1766D3",
        borderRadius: 8
      },
    ],
  });

  const [loading, setLoading] = useState(true);

  // Konversi nama bulan Indonesia ke nomor
  const bulanKeNomor = {
    'Januari': '01', 'Februari': '02', 'Maret': '03',
    'April': '04', 'Mei': '05', 'Juni': '06',
    'Juli': '07', 'Agustus': '08', 'September': '09',
    'Oktober': '10', 'November': '11', 'Desember': '12'
  };

  // Fetch data statistik dan chart
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch statistik dari profil endpoint
      const profilRes = await api.get('/admin/profil');
      const statistik = profilRes.data.statistik || {};

      setStats({
        total_produk: statistik.total_produk || 0,
        total_kategori: statistik.total_kategori || 0,
        total_pemasukan: statistik.total_pemasukan || 0,
        total_transaksi: statistik.total_transaksi || 0,
      });

      // Fetch data chart
      await fetchChartData();
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const bulanNomor = bulanKeNomor[month] || '01';
      const chartRes = await api.get(`/admin/chart?bulan=${bulanNomor}&tahun=${year}`);
      const data = chartRes.data;

      setChartData({
        labels: data.labels || ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
        datasets: [{
          label: 'Penjualan',
          data: data.datasets?.[0]?.data || [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: "#1766D3",
          borderRadius: 8
        }]
      });
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    setOpenMonth(false);
    fetchChartData();
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
    setOpenYear(false);
    fetchChartData();
  };

  const formatRupiah = (angka) => {
    return 'Rp ' + Number(angka || 0).toLocaleString('id-ID');
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  const exportPDF = async () => {
    const input = chartRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 90);
    pdf.save("laporan-penjualan.pdf");
  };

  const statCards = [
    {
      title: "Total Produk",
      value: stats.total_produk.toString(),
      icon: <ShoppingBasket size={22} className="text-[#1766D3]" />
    },
    {
      title: "Total Kategori",
      value: stats.total_kategori.toString(),
      icon: <Users size={22} className="text-[#1766D3]" />
    },
    {
      title: "Total Pemasukan",
      value: formatRupiah(stats.total_pemasukan),
      icon: <BanknoteArrowUp size={22} className="text-[#1766D3]" />
    },
    {
      title: "Total Transaksi",
      value: stats.total_transaksi.toString(),
      icon: <NotepadText size={22} className="text-[#1766D3]" />
    },
  ];

  const bulanList = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const tahunList = ["2024", "2025", "2026", "2027", "2028"];

  return (
    <AppLayout role="admin">
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
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
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
          ) : (
            statCards.map((item, i) => (
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
            ))
          )}
        </div>

        {/* FILTER */}
        <div className="px-6 md:px-10 flex flex-col md:flex-row gap-3 md:justify-between md:items-center">

          <button
            onClick={exportPDF}
            className="bg-red-500 hover:bg-red-600 active:scale-95 text-white px-4 py-2 rounded-xl transition w-full md:w-auto"
          >
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
                <span className={`transition ${openMonth ? "rotate-180" : ""}`}>▼</span>
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
                <span className={`transition ${openYear ? "rotate-180" : ""}`}>▼</span>
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
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Grafik Penjualan - {month} {year}
            </h3>

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
