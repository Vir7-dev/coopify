import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AppLayout from "../Layouts/AppLayout";
import Pagination from "../components/Pagination";
import api from "../api";
import {
  FaSearch, FaEdit, FaTrash, FaPlus, FaBox, FaTags,
  FaCalendarAlt, FaLayerGroup, FaTimes,
  ICON_LIST, suggestIcon, DynIcon
} from "../constants/icons.jsx";

const ICON_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-teal-100 text-teal-600",
];

export default function KelolaKategori() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKat, setFilterKat] = useState(null); // id kategori filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({ nama: "", ikon: "FaBox" });

  const fetchData = () => {
    api.get("/kategori")
      .then((res) => {
        const d = res.data;
        console.log("Data kategori diterima:", d);
        const normalized = d.map((item) => ({
          id: item?.id ?? null,
          nama: item?.nama ?? "-",
          ikon: item?.ikon ?? "FaBox",
          stok: item?.stok ?? 0,
          tgl: item?.tgl ?? null,
        }));
        setProducts(normalized);
      })
      .catch((e) => console.error("Gagal fetch kategori:", e));
  };
  useEffect(() => { fetchData(); }, []);

  const totalKategori = products.length;
  const totalProduk = products.reduce((s, p) => s + (p.stok || 0), 0);
  const terakhirUpdate = products.length
    ? (() => {
      const validDates = products.map((p) => new Date(p.tgl)).filter((d) => !isNaN(d));
      if (!validDates.length) return "-";
      return new Date(Math.max(...validDates))
        .toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    })()
    : "-";
  const terbanyak = products.length
    ? products.reduce((a, b) => (a.stok > b.stok ? a : b)).nama
    : "-";

  const filtered = products.filter((p) => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterKat === null || p.id === filterKat;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfFirst + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [search, filterKat]);

  const handleNamaChange = (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, nama: val, ikon: suggestIcon(val) }));
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Modal handlers
  const handleAdd = () => {
    setIsEdit(false);
    setSelectedProduct(null);
    setForm({ nama: "", ikon: "FaBox" });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setSelectedProduct(item);
    setForm({ nama: item.nama, ikon: item.ikon || "FaBox" });
    setShowModal(true);
  };

  // Hapus
  const handleDeleteClick = (item) => {
    Swal.fire({
      title: "Hapus Kategori?",
      html: `Yakin mau hapus kategori <b>${item.nama}</b>?<br/><span style="font-size:13px;color:#6b7280">Produk di kategori ini tidak ikut terhapus.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/kategori/${item.id}`);
          setProducts((prev) => prev.filter((p) => p.id !== item.id));
          if (filterKat === item.id) setFilterKat(null);
          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: `Kategori "${item.nama}" berhasil dihapus.`,
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Terjadi kesalahan saat menghapus kategori",
          });
        }
      }
    });
  };
  const handleSubmit = async () => {
    if (!form.nama.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian!",
        text: "Nama kategori tidak boleh kosong!",
        confirmButtonColor: "#1D63D3",
      });
      return;
    }

    const body = { nama_kategori: form.nama, ikon: form.ikon };

    try {
      if (isEdit) {
        const r = await api.put(`/kategori/${selectedProduct.id}`, body);
        const updated = r.data;
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id
              ? { ...p, nama: updated.nama, ikon: updated.ikon }
              : p
          )
        );
      } else {
        const r = await api.post("/kategori", body);
        const newItem = r.data;
        setProducts((prev) => [...prev, newItem]);
      }

      setShowModal(false);
      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: isEdit
            ? "Kategori berhasil diupdate"
            : "Kategori berhasil ditambahkan",
          timer: 2000,
          showConfirmButton: false,
        });
      }, 300);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.response?.data?.message || "Terjadi kesalahan saat menyimpan kategori",
      });
    }
  };

  // Render
  return (
    <AppLayout role="admin" showFooter={false}>
      <div className="w-full">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold">Kelola Kategori Produk</h1>
            <p className="text-sm text-gray-500">Manajemen kategori produk koperasi</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#1766D3] hover:bg-[#3D8FFF] text-white text-sm px-4 py-2 rounded-lg transition"
          >
            <FaPlus /> Tambahkan Kategori
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Total Kategori */}
          <div className="group relative bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 w-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative z-10 bg-blue-100 text-blue-600 p-3 rounded-lg group-hover:scale-110 transition duration-300">
              <FaLayerGroup />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-gray-500">Total Kategori</p>
              <h2 className="text-lg font-semibold group-hover:text-blue-600 transition">{totalKategori}</h2>
            </div>
          </div>

          {/* Total Produk */}
          <div className="group relative bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 w-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative z-10 bg-green-100 text-green-600 p-3 rounded-lg group-hover:scale-110 transition duration-300">
              <FaBox />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-gray-500">Total Produk</p>
              <h2 className="text-lg font-semibold group-hover:text-green-600 transition">{totalProduk}</h2>
            </div>
          </div>

          {/* Tanggal Dibuat */}
          <div className="group relative bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 w-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative z-10 bg-orange-100 text-orange-600 p-3 rounded-lg group-hover:scale-110 transition duration-300">
              <FaCalendarAlt />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-gray-500">Tanggal Dibuat</p>
              <h2 className="text-sm font-semibold group-hover:text-orange-600 transition">{terakhirUpdate}</h2>
            </div>
          </div>

          {/* Kategori Terbanyak */}
          <div className="group relative bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 w-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative z-10 bg-purple-100 text-purple-600 p-3 rounded-lg group-hover:scale-110 transition duration-300">
              <FaTags />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-gray-500">Kategori Terbanyak</p>
              <h2 className="text-sm font-semibold group-hover:text-purple-600 transition">{terbanyak}</h2>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm text-left">

          {/* SEARCH */}
          <div className="p-4 flex justify-between items-center">
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            {filterKat !== null && (
              <button
                onClick={() => setFilterKat(null)}
                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
              >
                <FaTimes size={10} /> Hapus filter
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-center">No</th>
                  <th className="px-4 py-3 text-left">Nama Kategori</th>
                  <th className="px-4 py-3 text-center">Jumlah Produk</th>
                  <th className="px-4 py-3 text-left">Tanggal Dibuat</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">
                      Tidak ada kategori ditemukan
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, i) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-400 text-center">{indexOfFirst + i + 1}</td>
                      <td className="border-b border-gray-100 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 flex items-center justify-center rounded-full ${ICON_COLORS[(indexOfFirst + i) % ICON_COLORS.length]}`}>
                            <DynIcon name={item.ikon} size={14} />
                          </div>
                          <div>
                            <p className="font-medium">{item?.nama}</p>
                            <p className="text-xs text-gray-400">Kategori produk {item?.nama?.toLowerCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-gray-100 px-4 py-3 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {item.stok} produk
                        </span>
                      </td>
                      <td className="border-b border-gray-100 px-4 py-3 text-gray-500">
                        {item?.tgl ? (
                          <>
                            {new Date(item.tgl).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            <p className="text-xs text-gray-400">
                              {new Date(item.tgl).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                            </p>
                          </>
                        ) : "-"}
                      </td>
                      <td className="border-b border-gray-100 px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md text-xs hover:bg-blue-50 flex items-center gap-1 transition"
                          >
                            <FaEdit size={10} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="border border-red-400 text-red-500 px-3 py-1 rounded-md text-xs hover:bg-red-50 flex items-center gap-1 transition"
                          >
                            <FaTrash size={10} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <Pagination
            currentItems={currentItems.length}
            totalItems={filtered.length}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />

          {/* ── MODAL TAMBAH & EDIT ── */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
              <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaLayerGroup size={18} />
                    <h2 className="text-lg font-semibold">
                      {isEdit ? "Edit Kategori" : "Tambah Kategori"}
                    </h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="hover:opacity-75 transition">
                    <FaTimes />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">

                  {/* Input nama */}
                  <div>
                    <label className="text-xs font-medium text-gray-600">Nama Kategori</label>
                    <input
                      type="text"
                      name="nama"
                      placeholder="Contoh: Makanan"
                      value={form.nama}
                      onChange={handleNamaChange}
                      className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    {form.nama && (
                      <p className="text-xs text-blue-500 mt-1">
                        Icon otomatis dipilih berdasarkan nama
                      </p>
                    )}
                  </div>

                  {/* Grid pilih icon */}
                  <div>
                    <label className="text-xs font-medium text-gray-600">Pilih Icon</label>
                    <p className="text-xs text-gray-400 mb-2">Klik untuk ganti icon secara manual</p>
                    <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {ICON_LIST.map((ic) => {
                        const Comp = ic.comp;
                        const isSelected = form.ikon === ic.name;
                        return (
                          <button
                            key={ic.name}
                            title={ic.label}
                            onClick={() => setForm((f) => ({ ...f, ikon: ic.name }))}
                            className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition text-xs gap-0.5 ${isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-500"
                              }`}
                          >
                            <Comp size={16} />
                          </button>
                        );
                      })}
                    </div>
                    {/* Preview icon terpilih */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <DynIcon name={form.ikon} size={14} />
                      </div>
                      <span className="text-xs">
                        {ICON_LIST.find((i) => i.name === form.ikon)?.label ?? "Icon"}
                      </span>
                    </div>
                  </div>

                  {/* Tombol aksi */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-[#1D63D3] hover:bg-blue-700 transition text-white py-2 rounded-lg text-sm font-bold active:scale-95"
                    >
                      {isEdit ? "Update" : "Simpan"}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 transition text-gray-700 py-2 rounded-lg text-sm font-bold active:scale-95"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}