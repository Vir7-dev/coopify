import React, { useRef, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardAdmin = () => {

  const chartRef = useRef();

  const [month, setMonth] = useState("Januari");
  const [year, setYear] = useState("2026");

  // 🔥 TAMBAHAN
  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  const data = {
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    datasets: [
      {
        label: "Penjualan",
        data: [38, 29, 50, 17, 27, 5],
        backgroundColor: "#1766D3",
        borderRadius: 8
      },
    ],
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

  return (
    <AppLayout role="admin">
      <div className="bg-gray-100 min-h-screen pb-20 space-y-12">

        {/* HEADER */}
        <div className="px-6 md:px-10 pt-6 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Dashboard Admin
          </h1>

          <input
            type="text"
            placeholder="Cari produk..."
            className="border border-gray-200 rounded-xl px-4 py-2 w-[250px] md:w-[320px] focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* BANNER */}
        <div className="px-6 md:px-10">
          <div
            className="w-full h-[400px] md:h-[500px] flex items-center rounded-2xl overflow-hidden"
            style={{
              backgroundImage: "url('/img/banner.admin.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full h-full bg-black/30 flex items-center px-6 md:px-12 text-white">
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
          {[
            { title: "Total Produk", value: "200", icon: "👜" },
            { title: "Total Pengguna", value: "200", icon: "👥" },
            { title: "Pemasukan", value: "Rp 1.500.000", icon: "💰" },
            { title: "Transaksi", value: "40", icon: "📄" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex items-center gap-3"
            >
              <div className="text-2xl bg-blue-50 p-3 rounded-xl">
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
            className="bg-red-500 hover:bg-red-600 active:scale-95 text-white px-4 py-2 rounded-xl transition w-full md:w-auto"
          >
            Export PDF
          </button>

          {/* 🔥 CUSTOM DROPDOWN */}
          <div className="flex gap-3 relative">

            {/* BULAN */}
            <div className="relative w-[160px]">
              <div
                onClick={() => {
                  setOpenMonth(!openMonth);
                  setOpenYear(false);
                }}
                className="border border-gray-200 rounded-xl px-4 py-2 bg-white cursor-pointer flex justify-between"
              >
                <span>{month}</span>
                <span>▼</span>
              </div>

              {openMonth && (
                <div className="absolute bottom-12 w-full bg-white rounded-xl shadow-lg max-h-[180px] overflow-y-auto z-50">
                  {[
                    "Januari","Februari","Maret","April","Mei","Juni",
                    "Juli","Agustus","September","Oktober","November","Desember"
                  ].map((m) => (
                    <div
                      key={m}
                      onClick={() => {
                        setMonth(m);
                        setOpenMonth(false);
                      }}
                      className={`px-4 py-2 cursor-pointer text-sm
                        ${month === m ? "bg-[#1766D3] text-white" : "hover:bg-gray-100"}
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
                className="border border-gray-200 rounded-xl px-4 py-2 bg-white cursor-pointer flex justify-between"
              >
                <span>{year}</span>
                <span>▼</span>
              </div>

              {openYear && (
                <div className="absolute bottom-12 w-full bg-white rounded-xl shadow-lg max-h-[180px] overflow-y-auto z-50">
                  {["2024","2025","2026","2027","2028"].map((y) => (
                    <div
                      key={y}
                      onClick={() => {
                        setYear(y);
                        setOpenYear(false);
                      }}
                      className={`px-4 py-2 cursor-pointer text-sm
                        ${year === y ? "bg-[#1766D3] text-white" : "hover:bg-gray-100"}
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
              Grafik Penjualan
            </h3>

            <div className="h-56">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default DashboardAdmin;