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
import { ShoppingBasket, Users, BanknoteArrowUp, NotepadText } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardAdmin = () => {

  const chartRef = useRef();

  const [month, setMonth] = useState("Januari");
  const [year, setYear] = useState("2026");

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
          {[
            {
              title: "Total Produk",
              value: "200",
              icon: <ShoppingBasket size={22} className="text-[#1766D3]" />
            },
            {
              title: "Total Pengguna",
              value: "200",
              icon: <Users size={22} className="text-[#1766D3]" />
            },
            {
              title: "Pemasukan",
              value: "Rp 1.500.000",
              icon: <BanknoteArrowUp size={22} className="text-[#1766D3]" />
            },
            {
              title: "Transaksi",
              value: "40",
              icon: <NotepadText size={22} className="text-[#1766D3]" />
            },
          ].map((item, i) => (
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
                  {["2024","2025","2026","2027","2028"].map((y) => (
                    <div
                      key={y}
                      onClick={() => {
                        setYear(y);
                        setOpenYear(false);
                      }}
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
