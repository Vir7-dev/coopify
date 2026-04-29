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
    { id: 1, nama: "Nabati", kategori: "Makanan", harga: 15000, jumlah: 10, tgl: "2026-04-20", status: "Selesai",gambar: "img/makanan1.jpg" },
    { id: 2, nama: "Teh kotak", kategori: "Minuman", harga: 8000, jumlah: 15, tgl: "2026-04-20", status: "Ambil Pesanan",gambar: "img/makanan1.jpg" },
    { id: 3, nama: "Paramex", kategori: "Obat & Kesehatan", harga: 25000, jumlah: 5, tgl: "2026-04-20", status: "Selesai",gambar: "img/makanan1.jpg" },
    { id: 4, nama: "Notebook", kategori: "Buku & Alat tulis", harga: 5000, jumlah: 10, tgl: "2026-04-20", status: "Selesai",gambar: "img/makanan1.jpg" },
    { id: 5, nama: "Almamater", kategori: "Almamater", harga: 120000, jumlah: 10, tgl: "2026-04-20", status: "Ambil Pesanan",gambar: "img/makanan1.jpg" },
    { id: 6, nama: "Roti O", kategori: "Makanan", harga: 7000, jumlah: 15, tgl: "2026-04-20", status: "Selesai",gambar: "img/makanan1.jpg" },
    { id: 7, nama: "Air Mineral", kategori: "Minuman", harga: 4000, jumlah: 30, tgl: "2026-04-20", status: "Selesai",gambar: "img/makanan1.jpg" },
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-600 active:scale-95 transition"
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

<div className="space-y-4 p-4">
  {currentItems.map((item) => (
    <div key={item.id} className="border border-gray-300 rounded-xl p-4 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">{item.kategori}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(item.status)}`}>
          {item.status}
        </span>
      </div>

      {/* Isi */}
      <div className="flex gap-4">
        {/* Gambar dummy */}
        <div className="w-16 h-16 bg-gray-200 rounded">
          <img
                                src={item.gambar}
                                alt={item.nama}
                                className="h-28 object-contain hover:scale-110 transition"
                            />

                            </div>

        <div className="flex-1">
          <h4 className="font-medium text-sm">{item.nama}</h4>
          <p className="text-xs text-gray-500">
            {new Date(item.tgl).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p className="text-sm font-semibold mt-1">
            Rp {item.harga.toLocaleString("id-ID")}
          </p>

          <p className="text-xs text-gray-500">
            Jumlah: {item.jumlah}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm font-bold">
          Total: Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
        </p>


      </div>
    </div>
  ))}
</div>
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