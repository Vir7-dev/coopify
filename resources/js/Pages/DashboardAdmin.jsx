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

      <div className="bg-gray-100 min-h-screen pb-24">

        {/* SEARCH */}
        <div className="px-10 mt-4 flex justify-end">
          <input
            type="text"
            placeholder="Cari produk..."
            className="border rounded-lg px-4 py-2 w-[450px]"
          />
        </div>

        {/* BANNER */}
        <div className="px-10 mt-14">
                    <div className="rounded-2xl overflow-hidden shadow-md">

                        <img
                            src="/img/banner.admin.png"
                            alt="banner"
                            className="w-full h-[350px] object-cover object-center"
                        />

                    </div>
                </div>

        {/* STATISTIK */}
        <div className="px-10 grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
            <div className="text-2xl">👜</div>
            <div>
              <p className="text-sm text-gray-500">Total Produk</p>
              <p className="font-bold text-lg">200</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
            <div className="text-2xl">👥</div>
            <div>
              <p className="text-sm text-gray-500">Total Pengguna</p>
              <p className="font-bold text-lg">200</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
            <div className="text-2xl">💰</div>
            <div>
              <p className="text-sm text-gray-500">Pemasukan Hari Ini</p>
              <p className="font-bold text-lg">Rp 1.500.000</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
            <div className="text-2xl">📄</div>
            <div>
              <p className="text-sm text-gray-500">Transaksi Hari Ini</p>
              <p className="font-bold text-lg">40</p>
            </div>
          </div>

        </div>

        {/* EXPORT + FILTER */}
        <div className="px-10 flex justify-between items-center mt-6">

          <button
            onClick={exportPDF}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Export PDF
          </button>

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
        <div className="px-10">
          <div ref={chartRef} className="bg-white mt-6 p-4 rounded-lg shadow">

            <div className="overflow-x-auto">
              <div className="min-w-[800px] h-48">
                <Bar data={data} options={options} />
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-green-600 text-white mt-24 p-6 text-center">
          <p className="font-semibold">
            Coopify Koperasi Kampus Digital
          </p>
          <p className="text-sm text-green-200">
            © 2026 Coopify
          </p>
        </div>

      </div>

    </AppLayout>
  );
};

export default DashboardAdmin;