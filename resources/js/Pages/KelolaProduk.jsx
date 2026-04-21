import React, { useState, useRef } from "react";
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

    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            console.log("File terpilih:", file);
        }
    };

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const products = [
        {
            id: 1,
            nama: "Nabati",
            kategori: "Makanan",
            harga: 15000,
            stok: 10,
            tgl: "2026-04-20",
        },

        {
            id: 2,
            nama: "Teh kotak",
            kategori: "Minuman",
            harga: 8000,
            stok: 15,
            tgl: "2026-04-20",
        },

        {
            id: 3,
            nama: "Paramex",
            kategori: "Obat & Kesehatan",
            harga: 25000,
            stok: 5,
            tgl: "2026-04-20",
        },

        {
            id: 4,
            nama: "Notebook",
            kategori: "Buku & Alat tulis",
            harga: 5000,
            stok: 10,
            tgl: "2026-04-20",
        },

        {
            id: 5,
            nama: "Almamater Polibatam",
            kategori: "Almamater",
            harga: 120000,
            stok: 10,
            tgl: "2026-04-20",
        },

        {
            id: 6,
            nama: "Roti O",
            kategori: "Makanan",
            harga: 7000,
            stok: 25,
            tgl: "2026-04-20",
        },

        {
            id: 7,
            nama: "Air Mineral",
            kategori: " Minuman",
            harga: 4000,
            stok: 30,
            tgl: "2026-04-20",
        },
        {
            id: 8,
            nama: "Teh Pucuk",
            kategori: " Minuman",
            harga: 4000,
            stok: 30,
            tgl: "2026-04-20",
        },
        {
            id: 9,
            nama: "Pena",
            kategori: " Buku & Alat tulis",
            harga: 4000,
            stok: 30,
            tgl: "2026-04-20",
        },
        {
            id: 10,
            nama: "Minyak kayu putih",
            kategori: " Obat & Kesehatan",
            harga: 4000,
            stok: 30,
            tgl: "2026-04-20",
        },
        {
            id: 11,
            nama: "Roma kelapa",
            kategori: " Makanan",
            harga: 4000,
            stok: 30,
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
            kategori: "",
            harga: "",
            stok: "",
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
            kategori: item.kategori,
            harga: item.harga,
            stok: item.stok,
            tgl: item.tgl,
        });

        setShowModal(true);
    };

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
        if (!form.nama || !form.stok || !form.tgl) {
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

    const confirmDelete = () => {
        console.log("Data dihapus:", selectedDelete);
        setShowDeleteModal(false);
        setSelectedDelete(null);
    };

    return (
        <AppLayout role="admin">
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
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
                            className="flex items-center gap-2  bg-[#3F7EA2] hover:bg-[#54A2CF] text-white text-sm px-4 py-2 rounded-lg"
                        >
                            <FaPlus /> Tambahkan Produk
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
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

                <div className="bg-white rounded-xl shadow-sm overflow-hidden text-left">
                    <div className="p-4 flex justify-between items-center">
                        <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                            <option>Semua Kategori</option>
                        </select>

                        <div className="relative w-64">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Cari kategori..."
                                className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 text-sm focus:outline-none"
                            />
                        </div>
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3">No</th>
                                <th className="px-4 py-3">Nama Produk</th>
                                <th className="px-4 py-3">Nama Kategori</th>
                                <th className="px-4 py-3">Harga</th>
                                <th className="px-4 py-3">Jumlah Stok</th>
                                <th className="px-4 py-3">
                                    Tanggal Kadalurasa
                                </th>
                                <th className="px-4 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, i) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-400">
                                        {indexOfFirstItem + i + 1}
                                    </td>

                                    <td className="border-b border-gray-200 px-4 py-3">
                                        <p className="font-medium">
                                            {item.nama}
                                        </p>
                                    </td>

                                    <td className="border-b border-gray-200 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                                                <FaBox size={14} />
                                            </div>
                                            <div>
                                                <div>
                                                    <p className="font-medium">
                                                        {item.kategori}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Kategori produk{" "}
                                                        {item.kategori.toLowerCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                                        Rp {item.harga.toLocaleString("id-ID")}
                                    </td>

                                    <td className="border-b border-gray-200 px-4 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                item.stok <= 5
                                                    ? "bg-red-100 text-orange-600"
                                                    : "bg-green-100 text-green-600"
                                            }`}
                                        >
                                            {item.stok} produk
                                        </span>
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
                                        <p className="text-xs text-gray-400">
                                            10:30 WIB
                                        </p>
                                    </td>

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

                    {/* PAGINATION */}
                    <div className="flex justify-between items-center p-4 text-sm text-gray-500">
                        <p>
                            Menampilkan {currentItems.length} dari{" "}
                            {products.length} kategori
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded-md disabled:opacity-40"
                            ></button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-md ${
                                        currentPage === i + 1
                                            ? "bg-blue-500 text-white"
                                            : "border"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded-md disabled:opacity-40"
                            ></button>
                        </div>
                    </div>
                </div>

                {/* MODAL TAMBAH & EDIT (VERSI RAMPIUNG) */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white w-full max-w-[400px] rounded-[10px] shadow-2xl overflow-hidden">
                            <div className="bg-[#0099D5] text-white px-5 py-3 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <FaBox className="text-white text-lg" />
                                    <h2 className="text-lg font-bold tracking-tight">
                                        {isEdit
                                            ? "Edit Produk"
                                            : "Tambah Produk"}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="hover:scale-110 transition-transform"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            <div className="p-5 space-y-3.5">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                            Nama Produk
                                        </label>
                                        <input
                                            type="text"
                                            name="nama"
                                            placeholder="Nama produk"
                                            value={form.nama}
                                            onChange={handleChange}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                            Harga Produk
                                        </label>
                                        <input
                                            type="number"
                                            name="harga"
                                            placeholder="Harga"
                                            value={form.harga}
                                            onChange={handleChange}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                        Upload Gambar
                                    </label>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    <div
                                        onClick={handleUploadClick}
                                        className="border-2 border-dashed border-gray-200 rounded-xl py-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="bg-[#1D63D3] p-1.5 rounded text-white mb-1">
                                            <FaPlus size={10} />
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {fileName
                                                ? fileName
                                                : "Choose File"}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                            Jumlah Stok
                                        </label>
                                        <input
                                            type="number"
                                            name="stok"
                                            placeholder="Stok"
                                            value={form.stok}
                                            onChange={handleChange}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                            Tgl Kadaluarsa
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="tgl"
                                                value={form.tgl}
                                                onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 bg-[#1D63D3] hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
                                    >
                                        Simpan
                                    </button>

                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-[#0099D5] hover:bg-[#0088C0] text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
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
        </AppLayout>
    );
}
