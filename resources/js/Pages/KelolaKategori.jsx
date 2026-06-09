import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import {
  FaSearch, FaEdit, FaTrash, FaPlus, FaBox, FaTags,
  FaCalendarAlt, FaLayerGroup, FaTimes, FaChevronLeft,
  FaChevronRight, FaUtensils, FaCoffee, FaPills, FaPencilAlt,
  FaTshirt, FaAppleAlt, FaHamburger, FaBreadSlice, FaCookie,
  FaIceCream, FaLeaf, FaCarrot, FaFish, FaDrumstickBite,
  FaWineGlass, FaGlassWhiskey, FaMugHot,
  FaCapsules, FaSyringe, FaHeartbeat, FaFirstAid, FaBandAid,
  FaGlasses, FaPen, FaRuler, FaBook, FaBookOpen, FaClipboard,
  FaStar, FaShoppingBag, FaTag, FaGift, FaStore,
} from "react-icons/fa";

// ============================================================
// ICON REGISTRY — nama string ↔ komponen
// ============================================================
const ICON_LIST = [
  { name: "FaUtensils",     comp: FaUtensils,     label: "Alat Makan" },
  { name: "FaHamburger",    comp: FaHamburger,    label: "Burger" },
  { name: "FaDrumstickBite",comp: FaDrumstickBite,label: "Ayam" },
  { name: "FaBreadSlice",   comp: FaBreadSlice,   label: "Roti" },
  { name: "FaCookie",       comp: FaCookie,       label: "Snack" },
  { name: "FaIceCream",     comp: FaIceCream,     label: "Dessert" },
  { name: "FaAppleAlt",     comp: FaAppleAlt,     label: "Buah" },
  { name: "FaCarrot",       comp: FaCarrot,       label: "Sayur" },
  { name: "FaLeaf",         comp: FaLeaf,         label: "Organik" },
  { name: "FaFish",         comp: FaFish,         label: "Seafood" },
  { name: "FaCoffee",       comp: FaCoffee,       label: "Kopi" },
  { name: "FaMugHot",       comp: FaMugHot,       label: "Teh" },
  { name: "FaGlassWhiskey", comp: FaGlassWhiskey, label: "Minuman" },
  { name: "FaWineGlass",    comp: FaWineGlass,    label: "Jus" },
  { name: "FaPills",        comp: FaPills,        label: "Obat" },
  { name: "FaCapsules",     comp: FaCapsules,     label: "Suplemen" },
  { name: "FaSyringe",      comp: FaSyringe,      label: "Medis" },
  { name: "FaHeartbeat",    comp: FaHeartbeat,    label: "Kesehatan" },
  { name: "FaFirstAid",     comp: FaFirstAid,     label: "P3K" },
  { name: "FaBandAid",      comp: FaBandAid,      label: "Perawatan" },
  { name: "FaPencilAlt",    comp: FaPencilAlt,    label: "Pensil" },
  { name: "FaPen",          comp: FaPen,          label: "Pena" },
  { name: "FaRuler",        comp: FaRuler,        label: "Penggaris" },
  { name: "FaBook",         comp: FaBook,         label: "Buku" },
  { name: "FaBookOpen",     comp: FaBookOpen,     label: "Buku Buka" },
  { name: "FaClipboard",    comp: FaClipboard,    label: "Clipboard" },
  { name: "FaGlasses",      comp: FaGlasses,      label: "Kacamata" },
  { name: "FaTshirt",       comp: FaTshirt,       label: "Almamater" },
  { name: "FaTag",          comp: FaTag,          label: "Label" },
  { name: "FaGift",         comp: FaGift,         label: "Hadiah" },
  { name: "FaShoppingBag",  comp: FaShoppingBag,  label: "Belanja" },
  { name: "FaStore",        comp: FaStore,        label: "Toko" },
  { name: "FaStar",         comp: FaStar,         label: "Bintang" },
  { name: "FaBox",          comp: FaBox,          label: "Kotak" },
];

// Render icon dari string nama — aman untuk null/undefined
function DynIcon({ name, size = 14, className = "" }) {
  if (!name || typeof name !== "string") return <FaBox size={size} className={className} />;
  const found = ICON_LIST.find((i) => i.name === name);
  if (!found) return <FaBox size={size} className={className} />;
  const Comp = found.comp;
  return <Comp size={size} className={className} />;
}

// Warna background icon per urutan (cycling)
const ICON_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-teal-100 text-teal-600",
];

// Auto-suggest icon berdasarkan keyword nama kategori
function suggestIcon(nama) {
  const n = nama.toLowerCase();
  if (n.includes("makan") || n.includes("nasi") || n.includes("lauk"))  return "FaUtensils";
  if (n.includes("minum") || n.includes("drink") || n.includes("air"))  return "FaGlassWhiskey";
  if (n.includes("kopi") || n.includes("coffee"))                       return "FaCoffee";
  if (n.includes("teh") || n.includes("tea"))                           return "FaMugHot";
  if (n.includes("jus") || n.includes("juice"))                         return "FaWineGlass";
  if (n.includes("snack") || n.includes("cemilan") || n.includes("kue")) return "FaCookie";
  if (n.includes("dessert") || n.includes("es krim") || n.includes("manis")) return "FaIceCream";
  if (n.includes("obat") || n.includes("medicine"))                     return "FaPills";
  if (n.includes("kesehatan") || n.includes("health"))                  return "FaHeartbeat";
  if (n.includes("suplemen") || n.includes("vitamin"))                  return "FaCapsules";
  if (n.includes("alat tulis") || n.includes("stationery"))             return "FaPencilAlt";
  if (n.includes("buku") || n.includes("book"))                         return "FaBook";
  if (n.includes("almamater") || n.includes("baju") || n.includes("seragam")) return "FaTshirt";
  if (n.includes("buah") || n.includes("fruit"))                        return "FaAppleAlt";
  if (n.includes("sayur") || n.includes("vegetable"))                   return "FaCarrot";
  if (n.includes("ayam") || n.includes("chicken"))                      return "FaDrumstickBite";
  if (n.includes("ikan") || n.includes("fish"))                         return "FaFish";
  if (n.includes("roti") || n.includes("bread"))                        return "FaBreadSlice";
  if (n.includes("paket") || n.includes("bundle"))                      return "FaGift";
  return "FaBox";
}

export default function KelolaKategori() {
  const [products, setProducts]           = useState([]);
  const [search, setSearch]               = useState("");
  const [filterKat, setFilterKat]         = useState(null); // id kategori filter
  const [currentPage, setCurrentPage]     = useState(1);
  const itemsPerPage = 10;

  const [showModal, setShowModal]         = useState(false);
  const [isEdit, setIsEdit]               = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDelete, setSelectedDelete]   = useState(null);

  const [form, setForm] = useState({ nama: "", ikon: "FaBox" });

  // ── Fetch data ──────────────────────────────────────────
  const fetchData = () => {
    fetch("http://localhost:8000/api/kategori")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then((d) => {
        console.log("Data kategori diterima:", d); // debug log
        // Normalisasi data — pastikan semua field ada
        const normalized = d.map((item) => ({
          id:   item?.id   ?? null,
          nama: item?.nama ?? "-",
          ikon: item?.ikon ?? "FaBox",
          stok: item?.stok ?? 0,
          tgl:  item?.tgl  ?? null,
        }));
        setProducts(normalized);
      })
      .catch((e) => console.error("Gagal fetch kategori:", e));
  };
  useEffect(() => { fetchData(); }, []);

  // ── Stats ────────────────────────────────────────────────
  const totalKategori  = products.length;
  const totalProduk    = products.reduce((s, p) => s + (p.stok || 0), 0);
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

  // ── Filter + search ──────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterKat === null || p.id === filterKat;
    return matchSearch && matchFilter;
  });

  const totalPages     = Math.ceil(filtered.length / itemsPerPage);
  const indexOfFirst   = (currentPage - 1) * itemsPerPage;
  const currentItems   = filtered.slice(indexOfFirst, indexOfFirst + itemsPerPage);

  // Reset page kalau filter/search berubah
  useEffect(() => { setCurrentPage(1); }, [search, filterKat]);

  // ── Auto-suggest icon saat nama berubah ──────────────────
  const handleNamaChange = (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, nama: val, ikon: suggestIcon(val) }));
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // ── Modal handlers ───────────────────────────────────────
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

  const handleDeleteClick = (item) => {
    setSelectedDelete(item);
    setShowDeleteModal(true);
  };

  // ── Submit tambah / edit ─────────────────────────────────
  const handleSubmit = () => {
    if (!form.nama.trim()) { alert("Isi nama kategori!"); return; }

    const body = { nama_kategori: form.nama, ikon: form.ikon };

    if (isEdit) {
      fetch(`http://localhost:8000/api/kategori/${selectedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((r) => r.json())
        .then((updated) => {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === selectedProduct.id
                ? { ...p, nama: updated.nama, ikon: updated.ikon }
                : p
            )
          );
          setShowModal(false);
        });
    } else {
      fetch("http://localhost:8000/api/kategori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((r) => r.json())
        .then((newItem) => {
          setProducts((prev) => [...prev, newItem]);
          setShowModal(false);
        });
    }
  };

  // ── Hapus ────────────────────────────────────────────────
  const confirmDelete = () => {
    fetch(`http://localhost:8000/api/kategori/${selectedDelete.id}`, {
      method: "DELETE",
    }).then(() => {
      setProducts((prev) => prev.filter((p) => p.id !== selectedDelete.id));
      if (filterKat === selectedDelete.id) setFilterKat(null);
      setShowDeleteModal(false);
      setSelectedDelete(null);
    });
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <AppLayout role="admin">
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.stok <= 3 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
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
          <div className="flex justify-between items-center p-4 text-sm text-gray-500">
            <p>Menampilkan {currentItems.length} dari {filtered.length} kategori</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md border font-medium transition ${currentPage === 1 ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50" : "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"}`}
              >
                <FaChevronLeft size={10} /> Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-2 py-1 text-xs rounded-md border transition ${currentPage === i + 1 ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md border font-medium transition ${currentPage === totalPages || totalPages === 0 ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50" : "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"}`}
              >
                Next <FaChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>

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
                      ✨ Icon otomatis dipilih berdasarkan nama
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
                          className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition text-xs gap-0.5 ${
                            isSelected
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

        {/* ── MODAL HAPUS ── */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-[350px] rounded-xl shadow-lg p-5">
              <h2 className="text-lg font-semibold mb-2">Konfirmasi Hapus</h2>
              <p className="text-sm text-gray-500 mb-4">
                Yakin mau hapus kategori{" "}
                <span className="font-semibold text-black">{selectedDelete?.nama}</span>?
                {" "}Produk di kategori ini tidak ikut terhapus.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
                >
                  Hapus
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}