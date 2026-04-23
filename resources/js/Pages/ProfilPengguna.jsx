import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaShoppingCart,
  FaUserCircle,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaBox,
 FaCreditCard,
 FaBoxOpen
} from "react-icons/fa";

export default function ProfilPengguna() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // DATA
  const data = [
    { id: 1, nama: "Nabati", kategori: "Makanan", harga: 15000, jumlah: 10, tgl: "2026-04-20", status: "Selesai" },
    { id: 2, nama: "Teh kotak", kategori: "Minuman", harga: 8000, jumlah: 15, tgl: "2026-04-20", status: "Ambil Pesanan" },
    { id: 3, nama: "Paramex", kategori: "Obat & Kesehatan", harga: 25000, jumlah: 5, tgl: "2026-04-20", status: "Selesai" },
    { id: 4, nama: "Notebook", kategori: "Buku & Alat tulis", harga: 5000, jumlah: 10, tgl: "2026-04-20", status: "Selesai" },
    { id: 5, nama: "Almamater", kategori: "Almamater", harga: 120000, jumlah: 10, tgl: "2026-04-20", status: "Ambil Pesanan" },
    { id: 6, nama: "Roti O", kategori: "Makanan", harga: 7000, jumlah: 15, tgl: "2026-04-20", status: "Selesai" },
    { id: 7, nama: "Air Mineral", kategori: "Minuman", harga: 4000, jumlah: 30, tgl: "2026-04-20", status: "Selesai" },
  ];

  //total pesanan
  const TotalPesanan = data.filter(
  item => item.status === "Selesai" || item.status === "Ambil Pesanan"
).length;
   //total belanja
 const TotalBelanja = data.reduce((total, item) => {
  return total + (item.harga * item.jumlah);
}, 0);
  //Ambil Pesanan
  const Ambil = data.filter(
  item => item.status === "Ambil Pesanan"
).length;
  //STATUS
  const getStatusStyle = (status) => {
    if (status === "Ambil Pesanan") {
      return "bg-blue-100 text-blue-600";
    }
    if (status === "Selesai") {
      return "bg-green-100 text-green-600";
    }
    return "bg-gray-100 text-gray-500";
  };
  // PAGINATION (FIX)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <AppLayout role="pengguna">
      <div className="bg-gray-100 min-h-screen">

        {/* HEADER */}
        <div className="bg-[#3F7EA2] text-white p-6 mx-6 mt-6 rounded-t-lg">
          <h2 className="text-lg font-semibold">Halo, Winda! 👋</h2>
          <p className="text-sm">
            Kelola akun dan pantau riwayat belanja kamu di sini
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white mx-6 p-6 rounded shadow flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="bg-green-400 text-white w-16 h-16 flex items-center justify-center rounded">
              WI
            </div>

            <div>
              <h3 className="font-bold text-lg">Winda</h3>

              <div className="mt-2 space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full">
                    <FaIdCard /> 43425105
                  </span>

                  <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full">
                    <FaPhone /> 08577800000
                  </span>
                </div>

                <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full w-fit">
                  <FaEnvelope /> winda@email.ac.id
                </span>
              </div>
            </div>
          </div>

          <button
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-md"
            onClick={() => navigate("/edit-profil")}
          >
            Edit Profil
          </button>
        </div>
       <div className="mx-6 grid grid-cols-3 sm:grid-cols-3 gap-4 mb-6 mt-6">
  
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 h-[80px]">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl text-lg">
     <FaShoppingCart />
    </div>
    <div>
      <p className="text-xs text-gray-500">Total Pesanan</p>
      <h2 className="text-xl font-bold">{TotalPesanan}</h2>
    </div>
  </div>

  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 h-[80px]">
    <div className="bg-green-100 text-green-600 p-3 rounded-xl text-lg">
<FaCreditCard />
    </div>
    <div>
      <p className="text-xs text-gray-500">Total Belanja</p>
<h2 className="text-xl font-bold">
  Rp {TotalBelanja.toLocaleString("id-ID")}
</h2>
    </div>
  </div>

  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 h-[80px]">
    <div className="bg-green-100 text-green-600 p-3 rounded-xl text-lg">
<FaBoxOpen />
    </div>
    <div>
      <p className="text-xs text-gray-500">Siap Diambil</p>
      <h2 className="text-xl font-bold">{Ambil}</h2>
    </div>
  </div>
</div>
      {/* TABEL RIWAYAT */}
      <div className="mx-6 mt-6 bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Riwayat Pesanan</h2>
        </div>

        <table className="w-full table-fixed text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">              <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Nama Produk</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Harga</th>
            <th className="px-4 py-3">Jumlah</th>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Status</th>
          </tr>
          </thead>

          <tbody>
            {currentItems.map((item, i) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-200 px-4 py-3 text-gray-400">
                  {indexOfFirstItem + i + 1}
                </td>

                <td className="border-b border-gray-200 px-4 py-3">
                  {item.nama}
                </td>

                <td className="border-b border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaBox className="text-blue-500" />
                    {item.kategori}
                  </div>
                </td>

                <td className="border-b border-gray-200 px-4 py-3">
                  Rp {item.harga.toLocaleString("id-ID")}
                </td>

                <td className="border-b border-gray-200 px-4 py-3">
                  {item.jumlah}
                </td>
                <td className="border-b border-gray-200 px-4 py-3 text-gray-500">
                  {new Date(item.tgl).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </td>
                <td className="border-b border-gray-200 px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-end items-center gap-3 p-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "border"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </AppLayout >
  );
}