import Swal from "sweetalert2";
import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function KelolaKategori() {
  const [kategori, setKategori] = useState([
    { id: 1, nama: "Makanan", ikon: "/img/makanan.jpg", jumlah: 8, tgl: "01-01-2026" },
    { id: 2, nama: "Minuman", ikon: "/img/minuman.jpg", jumlah: 5, tgl: "01-01-2026" },
    { id: 3, nama: "Obat", ikon: "/img/obat.jpg", jumlah: 3, tgl: "01-01-2026" },
    { id: 4, nama: "Alat Tulis", ikon: "/img/alat_tulis.jpg", jumlah: 5, tgl: "01-01-2026" },
    { id: 5, nama: "Almamater", ikon: "/img/almamater.jpg", jumlah: 10, tgl: "01-01-2026" },
  ]);

  const [search, setSearch] = useState("");
  const [showTambah, setShowTambah] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formNama, setFormNama] = useState("");

  const filtered = kategori.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ TAMBAH + ALERT
  const handleTambah = () => {
    if (!formNama.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Nama kategori tidak boleh kosong!",
      });
      return;
    }

    setKategori([
      ...kategori,
      {
        id: Date.now(),
        nama: formNama,
        ikon: "/img/ikon.jpg",
        jumlah: 0,
        tgl: "01-01-2026",
      },
    ]);

    setShowTambah(false);
    setFormNama("");

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Kategori berhasil ditambahkan",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // ✅ EDIT + ALERT
  const handleEdit = () => {
    setKategori(
      kategori.map((item) =>
        item.id === selected.id ? { ...item, nama: formNama } : item
      )
    );

    setShowEdit(false);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Kategori berhasil diupdate",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // ✅ DELETE + KONFIRMASI + ALERT
  const handleDelete = () => {
    Swal.fire({
      title: "Yakin hapus?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setKategori(kategori.filter((item) => item.id !== selected.id));
        setShowDelete(false);

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Kategori berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };
  
  return (
    <AppLayout role="admin">
      <div className="w-full">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-semibold">Kelola Kategori</h1>
            <p className="text-sm text-gray-500 mt-1">Manajemen kategori produk koperasi</p>

            {/* SEARCH */}
            <div className="relative mt-3 w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-full rounded-full border text-sm focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          <button
            onClick={() => { setFormNama(""); setShowTambah(true); }}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition">
            <FaPlus /> Tambah
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-center w-12">No</th>
                <th className="px-4 py-3 text-left">Nama Kategori</th>
                <th className="px-4 py-3 text-center">Jumlah Produk</th>
                <th className="px-4 py-3 text-center">Tanggal Dibuat</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">

                  <td className="px-4 py-3 text-center align-middle text-gray-500">
                    {i + 1}
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <img src={item.ikon} className="w-9 h-9 rounded-lg object-cover" />
                      <span className="font-medium text-gray-700">{item.nama}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center align-middle">
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs"> 
                      {item.jumlah} Produk
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center align-middle text-gray-600">
                    {item.tgl}
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => { setSelected(item); setFormNama(item.nama); setShowEdit(true); }}
                        className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => { setSelected(item); setShowDelete(true); }}
                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                        title="Hapus"
                      >
                        <FaTrash size={13} />
                          Hapus
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    Tidak ada data kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL TAMBAH */}
        {showTambah && (
          <Modal title="Tambah Kategori" onClose={() => setShowTambah(false)}>
           <input
  type="text"
  required
  placeholder="Nama kategori"
  value={formNama}
  onChange={(e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setFormNama(value);
  }}
  className="w-full border px-3 py-2 mb-4 rounded-lg text-sm"
/>
            <div className="flex justify-end gap-2">
              <BtnBatal onClick={() => setShowTambah(false)} />
              <button onClick={handleTambah} className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition">
                Simpan
              </button>
            </div>
          </Modal>
        )}

        {/* MODAL EDIT */}
        {showEdit && (
          <Modal title="Edit Kategori" onClose={() => setShowEdit(false)}>
            <input
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex justify-end gap-2">
              <BtnBatal onClick={() => setShowEdit(false)} />
              <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition">
                Update
              </button>
            </div>
          </Modal>
        )}

        {/* MODAL DELETE */}
        {showDelete && (
          <Modal title="Hapus Kategori" onClose={() => setShowDelete(false)}>
            <p className="text-sm text-gray-600 mb-4">
              Yakin ingin menghapus kategori <span className="font-semibold text-gray-800">{selected?.nama}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <BtnBatal onClick={() => setShowDelete(false)} />
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition">
                Hapus
              </button>
            </div>
          </Modal>
        )}

      </div>
    </AppLayout>
  );
}

// ── Komponen modal reusable ──────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
        <h2 className="font-semibold text-base mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function BtnBatal({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-sm px-4 py-2 rounded-lg border hover:bg-gray-100 transition text-gray-600"
    >
      Batal
    </button>
  );
}