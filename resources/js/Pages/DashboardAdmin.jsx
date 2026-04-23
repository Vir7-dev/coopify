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

  const data = {
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    datasets: [
      {
        label: "Penjualan",
        data: [38, 29, 50, 17, 27, 5],
        backgroundColor: "#2563eb",
        barThickness: 20
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
    <AppLayout>

    <div className="bg-gray-200 min-h-screen">

      <div className="p-6">

        {/* BREADCRUMB + SEARCH */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Beranda &gt; Kategori &gt; <span className="font-semibold">Makanan</span>
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari..."
              className="bg-gray-100 px-4 py-2 rounded-full outline-none w-64"
            />
            <span className="absolute right-3 top-2">🔍</span>
          </div>
        </div>

        {/* BANNER */}
        <div className="bg-gray-100 border rounded-lg p-4">
          <img
            src="https://illustrations.popsy.co/gray/shopping.svg"
            alt="banner"
            className="w-full h-40 object-contain"
          />
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

          <div className="bg-gray-300 rounded-lg p-4 flex items-center gap-3">
            <div className="text-2xl">👜</div>
            <div>
              <p className="text-sm text-gray-700">Total Produk</p>
              <p className="font-bold text-sm">200 Produk</p>
            </div>
          </div>

          <div className="bg-gray-300 rounded-lg p-4 flex items-center gap-3">
            <div className="text-2xl">👥</div>
            <div>
              <p className="text-sm text-gray-700">Total Pengguna</p>
              <p className="font-bold text-sm">200 Pengguna</p>
            </div>
          </div>

          <div className="bg-gray-300 rounded-lg p-4 flex items-center gap-3">
            <div className="text-2xl">💰</div>
            <div>
              <p className="text-sm text-gray-700">Pemasukan hari ini</p>
              <p className="font-bold text-sm">Rp.1.500.000</p>
            </div>
          </div>

          <div className="bg-gray-300 rounded-lg p-4 flex items-center gap-3">
            <div className="text-2xl">📄</div>
            <div>
              <p className="text-sm text-gray-700">Transaksi Hari ini</p>
              <p className="font-bold text-sm">40 Transaksi</p>
            </div>
          </div>

        </div>

        {/* FITUR EXPORT + FILTER */}
        <div className="flex justify-between items-center mt-6">

          {/* Export PDF */}
          <button
            onClick={exportPDF}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Export PDF
          </button>

          {/* Filter Bulan & Tahun */}
          <div className="flex gap-2">

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option>Januari</option>
              <option>Februari</option>
              <option>Maret</option>
              <option>April</option>
              <option>Mei</option>
              <option>Juni</option>
              <option>Juli</option>
              <option>Agustus</option>
              <option>September</option>
              <option>Oktober</option>
              <option>November</option>
              <option>Desember</option>
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>

          </div>

        </div>

        {/* CHART */}
        <div ref={chartRef} className="bg-white mt-6 p-4 rounded-lg shadow">

          {/* Scroll Grafik */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px] h-48">
              <Bar data={data} options={options} />
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="bg-green-600 text-white px-6 py-6 mt-10">
        <p className="text-center text-sm">
          © 2026 Coopify, Koperasi Kampus Digital.
        </p>
      </div>

    </div>

    </AppLayout>
  );
};

export default DashboardAdmin;