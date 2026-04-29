import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaBox,
  FaTags,
  FaCalendarAlt,
  FaLayerGroup,
  FaTimes,
  FaCheck,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

export default function KelolaProduk() {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    stok: "",
    tgl: "",
  });


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const products = [
    {
      id: 1,
      nama: "Makanan",
      stok: 10,
      tgl: "2026-04-20",
    },
    {
      id: 2,
      nama: "Minuman",
      stok: 15,
      tgl: "2026-04-20",
    },
    {
      id: 3,
      nama: "Obat & Kesehatan",
      stok: 5,
      tgl: "2026-04-20",
    },
    {
      id: 3,
      nama: "Alat tulis",
      stok: 10,
      tgl: "2026-04-20",
    },
    {
      id: 3,
      nama: "Almamater",
      stok: 10,
      tgl: "2026-04-20",
    },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // TAMBAH
  const handleAdd = () => {
    setIsEdit(false);
    setSelectedProduct(null);
    setForm({
      nama: "",
      tgl: "",
    });

    setShowModal(true);
  };

  // EDIT
  const handleEdit = (item) => {
    setIsEdit(true);
    setSelectedProduct(item);
    setForm({
      nama: item.nama,
      tgl: item.tgl,
    });

    setShowModal(true);
  };

  // HAPUS (klik tombol)
  const handleDeleteClick = (item) => {
    setSelectedDelete(item);
    setShowDeleteModal(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!form.nama || !form.tgl) {
      alert("Isi semua data!");
      return;
    }

    if (isEdit) {
      console.log("Update:", form);
    } else {
      console.log("Tambah:", form);
    }

    setShowModal(false);
  };

  // KONFIRMASI HAPUS
  const confirmDelete = () => {
    console.log("Data dihapus:", selectedDelete);

    setShowDeleteModal(false);
    setSelectedDelete(null);
  };

  return (
    <AppLayout role="admin">
      <div className="w-full">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              Kelola Kategori Produk
            </h1>
            <p className="text-sm text-gray-500">
              Manajemen kategori produk koperasi
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2  bg-[#3F7EA2] hover:bg-[#54A2CF] text-white text-sm px-4 py-2 rounded-lg w-full sm:w-auto justify-center"
            >
              <FaPlus /> Tambahkan Kategori
            </button>
          </div>
        </div>

        {/* CARD SUMMARY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <FaLayerGroup />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Total Kategori
              </p>
              <h2 className="text-lg font-semibold">5</h2>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <FaBox />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Total Produk
              </p>
              <h2 className="text-lg font-semibold">55</h2>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Terakhir Update
              </p>
              <h2 className="text-sm font-semibold">
                20 April 2026
              </h2>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <FaTags />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Kategori Terbanyak
              </p>
              <h2 className="text-sm font-semibold">Minuman</h2>
            </div>
          </div>
        </div>

        {/* TABLE MODERN */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden text-left">
          <div className="p-4 flex justify-between items-center">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Cari kategori..."
                className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 text-sm focus:outline-none"
              />
            </div>
          </div>


         <div className="overflow-x-auto">
  <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama Kategori</th>
                <th className="px-4 py-3">Jumlah Produk</th>
                <th className="px-4 py-3">Tanggal Dibuat</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 ">
                  <td className="px-4 py-3 text-gray-400">
                    {indexOfFirstItem + i + 1}
                  </td>

                  {/* NAMA + SUBTEXT */}
                  <td className="border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                        <FaBox size={14} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.nama}
                        </p>
                        <p className="text-xs text-gray-400">
                          Kategori produk{" "}
                          {item.nama.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* BADGE */}
                  <td className="border-b border-gray-200 px-4 py-3 ">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${item.stok <= 5
                        ? "bg-red-100 text-orange-600"
                        : "bg-green-100 text-green-600"
                        }`}
                    >
                      {item.stok} produk
                    </span>
                  </td>

                  {/* TANGGAL */}
                  <td className="border-b border-gray-200 px-4 py-3 text-gray-500">
                    {new Date(item.tgl).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                    <p className="text-xs text-gray-400">
                      10:30 WIB
                    </p>
                  </td>

                  {/* AKSI */}
                  <td className="border-b border-gray-200 px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md text-xs hover:bg-blue-50 flex items-center gap-1"
                      >
                        <FaEdit size={10} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteClick(item)
                        }
                        className="border border-red-400 text-red-500 px-3 py-1 rounded-md text-xs hover:bg-red-50 flex items-center gap-1"
                      >
                        <FaTrash size={10} />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 text-sm text-gray-500">

            {/* Info kiri */}
            <p>
              Menampilkan {currentItems.length} dari {products.length} kategori
            </p>

            {/* Pagination kanan */}
            <div className="flex items-center gap-1">

              {/* Previous */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md border font-medium transition-colors
        ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                    : "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                  }`}
              >
                <FaChevronLeft size={10} />
                Previous
              </button>

              {/* Nomor Halaman */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-2 py-1 text-xs rounded-md border ${currentPage === i + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md border font-medium transition-colors
        ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                    : "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                  }`}
              >
                Next
                <FaChevronRight size={10} />
              </button>

            </div>
          </div>

        {/* MODAL TAMBAH & EDIT */}
{showModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
   <div className="bg-white w-full max-w-[420px] mx-4 rounded-2xl shadow-lg overflow-hidden">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaLayerGroup size={18} className="text-white mt-0.5" />
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
        </div>

        <button onClick={() => setShowModal(false)}>
          <FaTimes />
        </button>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-4">

        {/* NAMA */}
        <div>
          <label className="text-xs text-gray-500">
            Nama Kategori
          </label>
          <input
            type="text"
            name="nama"
            placeholder="Contoh: Makanan"
            value={form.nama}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* TANGGAL */}
        <div>
          <label className="text-xs text-gray-500">
            Tanggal Dibuat
          </label>
          <input
            type="date"
            name="tgl"
            value={form.tgl}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* BUTTON */}
        <div className="flex gap-3 pt-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#1D63D3] hover:bg-blue-700 transition text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold active:scale-95"
          >
            {isEdit ? "Update" : "Simpan"}
          </button>

          <button
            onClick={() => setShowModal(false)}
            className="flex-1 bg-[#0099D5] hover:bg-[#0088C0] transition text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold active:scale-95"
          >
            Batal
          </button>
        </div>
      </div>

    </div>
  </div>
)}
              {/* MODAL HAPUS */}
              {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                  <div className="bg-white w-[350px] rounded-xl shadow-lg p-5">

                    <h2 className="text-lg font-semibold mb-2">
                      Konfirmasi Hapus
                    </h2>

                    <p className="text-sm text-gray-500 mb-4">
                      Yakin mau hapus kategori{" "}
                      <span className="font-semibold text-black">
                        {selectedDelete?.nama}
                      </span>
                      ?
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={confirmDelete}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
                      >
                        Hapus
                      </button>

                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg text-sm"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
      </div>
    </AppLayout>
  );
}