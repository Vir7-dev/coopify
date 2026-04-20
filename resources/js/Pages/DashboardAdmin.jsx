import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const data = {
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    datasets: [
      {
        label: "Penjualan",
        data: [38, 29, 50, 17, 27, 5],
        backgroundColor: "#3b82f6"
      }
    ]
  };

  return (
    <div className="bg-gray-200 min-h-screen">

      {/* NAVBAR */}
      <div className="flex justify-between items-center bg-[#2f5d73] text-white px-6 py-3">
        <h1 className="text-xl font-bold">Coopify</h1>

        <div className="space-x-6 hidden md:block">
          <span>Home</span>
          <span>Kategori Produk</span>
          <span>Hubungi</span>
        </div>

        <div className="text-lg">🔔 👤</div>
      </div>

      {/* CONTENT */}
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
        <div className="bg-white rounded-lg p-4 shadow">
          <img
            src="https://illustrations.popsy.co/gray/shopping.svg"
            alt="banner"
            className="w-full h-40 object-contain"
          />
        </div>

        {/* KATEGORI + PEMASUKAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

          {/* ICON KATEGORI */}
          <div className="bg-gray-100 p-4 rounded-xl flex justify-around items-center col-span-2">
            {[
              { name: "Makanan", icon: "🍜" },
              { name: "Obat", icon: "💊" },
              { name: "Alat Tulis", icon: "✏️" },
              { name: "Almamater", icon: "🎓" },
              { name: "Minuman", icon: "🥤" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="bg-gradient-to-b from-green-200 to-blue-200 w-14 h-14 flex items-center justify-center rounded-full text-xl shadow">
                  {item.icon}
                </div>
                <p className="text-xs mt-2">{item.name}</p>
              </div>
            ))}
          </div>

          {/* PEMASUKAN */}
          <div className="bg-gradient-to-r from-green-300 to-blue-300 rounded-xl p-4 text-white shadow flex items-center justify-between">
            <div>
              <p className="text-sm">PEMASUKAN</p>
              <h2 className="text-xl font-bold">Rp.20.000</h2>
            </div>
            <div className="bg-white text-green-500 rounded-full p-3 text-xl">
              $
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white mt-6 p-4 rounded-xl shadow">
          <Bar data={data} />
        </div>

      </div>

      {/* FOOTER */}
      <div className="bg-green-600 text-white px-6 py-6 mt-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-xl font-bold">Coopify</h2>
            <p className="text-sm mt-2">
              Aplikasi koperasi digital kampus yang memudahkan aktivitas akademik
              bertransaksi online dengan cepat, mudah, dan aman.
            </p>
          </div>

          <div>
            <p className="font-semibold">IKUTI KAMI</p>
            <div className="text-xl mt-2">📸 ▶️</div>
          </div>

          <div>
            <p className="font-semibold">NAVIGASI</p>
            <p className="text-sm mt-2">Home</p>
            <p className="text-sm">Kategori Produk</p>
          </div>
        </div>

        <p className="text-center text-sm mt-6">
          © 2026 Coopify, Koperasi Kampus Digital.
        </p>
      </div>
    </div>
  );
};

export default DashboardAdmin;