import React, { useState, useRef, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import axios from "axios";
import Swal from "sweetalert2";
import api, { API_BASE_URL } from "../api";
import ProdukModal from "../components/ProdukModal";
import OpnameStokModal from "../components/OpnameStokModal";
import HapusProdukModal from "../components/HapusProdukModal";
import Pagination from "../components/Pagination";
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
    FaExclamationTriangle,
    FaClipboardCheck,
} from "react-icons/fa";

export default function KelolaProduk() {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState(null);
    const [search, setSearch] = useState("");
    const [filterKategori, setFilterKategori] = useState("Semua");
    const [products, setProducts] = useState([]);
    const [diskon, setDiskon] = useState([]);
    const [showOpnameModal, setShowOpnameModal] = useState(false);

    useEffect(() => {
        api.get("/produk")
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => console.log(err));

        api.get("/diskon").then((res) => {
            setDiskon(res.data.data);
        });
    }, []);

    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;

        if (files.length > 0) {
            setFileName(`${files.length} file dipilih`);
            console.log(`${files.length} file dipilih`);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredProducts = products.filter((item) => {
        const matchSearch = item.nama_produk
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchKategori =
            filterKategori === "Semua" ||
            item.kategori?.nama_kategori?.trim().toLowerCase() ===
                filterKategori.toLowerCase();

        return matchSearch && matchKategori;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Tambah STOK OPNAME
    const handleOpname = async (data) => {
        try {
            await api.post("/produk/tambah-stok", {
                id_produk: data.id_produk,
                jumlah_tambah: data.jumlah_tambah,
            });

            const res = await api.get("/produk");
            setProducts(res.data);

            setShowOpnameModal(false);

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Stok berhasil ditambahkan",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: error.response?.data?.message || "Terjadi kesalahan",
            });
        }
    };

    // TAMBAH
    const handleAdd = () => {
        setIsEdit(false);
        setSelectedProduct(null);

        setForm({
            nama_produk: "",
            harga_jual: "",
            stok: "",
            persen_diskon: "",
            id_kat_fk_p: "",
            deskripsi: "",
        });
        setShowModal(true);
    };

    const [form, setForm] = useState({
        nama_produk: "",
        harga_jual: "",
        stok: "",
        persen_diskon: "",
        id_kat_fk_p: "",
        deskripsi: "",
    });

    // EDIT
    const handleEdit = (item) => {
        setIsEdit(true);
        setSelectedProduct(item);

        setForm({
            nama_produk: item.nama_produk,
            harga_jual: item.harga_jual,
            stok: item.stok,
            persen_diskon: item.diskon?.persen_diskon ?? "",
            id_kat_fk_p: item.id_kat_fk_p,
            deskripsi: item.deskripsi,
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

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("nama_produk", form.nama_produk);
            formData.append("harga_jual", form.harga_jual);
            formData.append("stok", form.stok);
            formData.append("persen_diskon", form.persen_diskon);
            formData.append("id_kat_fk_p", form.id_kat_fk_p);
            formData.append("deskripsi", form.deskripsi);

            const files = fileInputRef.current.files;

            for (let i = 0; i < files.length; i++) {
                formData.append("url_gambar[]", files[i]);
            }

            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            if (isEdit) {
                formData.append("_method", "PUT");
                await api.post(
                    `/produk/${selectedProduct.id_produk}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } },
                );
            } else {
                await api.post("/produk", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            const res = await api.get("/produk");
            setProducts(res.data);

            setShowModal(false);
            setFileName("");
            setForm({
                nama_produk: "",
                harga_jual: "",
                stok: "",
                persen_diskon: "",
                id_kat_fk_p: "",
                deskripsi: "",
            });

            setShowModal(false);

            setTimeout(() => {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: isEdit
                        ? "Produk berhasil diupdate"
                        : "Produk berhasil ditambahkan",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }, 300);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: error.response?.data?.message || "Terjadi kesalahan",
            });
        }
    };
    const confirmDelete = async () => {
        try {
            await api.delete(`/produk/${selectedDelete.id_produk}`);

            const res = await api.get("/produk");
            setProducts(res.data);

            setShowDeleteModal(false);
            setSelectedDelete(null);

            setTimeout(() => {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Produk berhasil dihapus",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }, 300);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: error.response?.data?.message || "Terjadi kesalahan",
            });
        }
    };

    const stokMenipisCount = products.filter(
        (item) => Number(item.stok) > 0 && Number(item.stok) <= 5,
    ).length;

    const getKategoriTerbanyak = () => {
        const kategoriCount = {};

        products.forEach((item) => {
            const kategori = item.kategori?.nama_kategori;

            if (kategori) {
                kategoriCount[kategori] = (kategoriCount[kategori] || 0) + 1;
            }
        });

        let maxKategori = "-";
        let maxJumlah = 0;

        Object.entries(kategoriCount).forEach(([nama, jumlah]) => {
            if (jumlah > maxJumlah) {
                maxJumlah = jumlah;
                maxKategori = nama;
            }
        });

        return maxKategori;
    };

    return (
        <AppLayout role="admin">
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-semibold">Kelola Produk</h1>
                        <p className="text-sm text-gray-500">
                            Manajemen produk koperasi
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-[#1766D3] hover:bg-[#3D8FFF] text-white text-sm px-4 py-2 rounded-lg"
                        >
                            <FaPlus /> Tambahkan Produk
                        </button>
                        <button
                            onClick={() => setShowOpnameModal(true)}
                            className="flex items-center gap-2 border border-[#1766D3] text-[#1766D3] hover:bg-blue-50 text-sm px-4 py-2 rounded-lg"
                        >
                            <FaClipboardCheck />
                            Opname Stok
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="group relative bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 w-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative z-10 bg-blue-100 text-blue-600 p-3 rounded-lg group-hover:scale-110 transition duration-300">
                            <FaLayerGroup />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm text-gray-500">
                                Total Produk
                            </p>
                            <h2 className="text-lg font-semibold group-hover:text-blue-600 transition">
                                {products.length}
                            </h2>
                        </div>
                    </div>

                    <div
                        className={`group relative bg-white p-4 rounded-xl shadow-sm flex items-center justify-between w-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default ${
                            stokMenipisCount > 0 ? "border border-red-100" : ""
                        }`}
                    >
                        <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 ${
                                stokMenipisCount > 0
                                    ? "bg-gradient-to-tr from-red-500/10 to-transparent"
                                    : "bg-gradient-to-tr from-orange-500/10 to-transparent"
                            }`}
                        ></div>

                        <div className="relative z-10 flex items-center gap-4">
                            <div
                                className={`p-3 rounded-lg group-hover:scale-110 transition duration-300 ${
                                    stokMenipisCount > 0
                                        ? "bg-red-100 text-red-600"
                                        : "bg-orange-100 text-orange-600"
                                }`}
                            >
                                {stokMenipisCount > 0 ? (
                                    <FaExclamationTriangle />
                                ) : (
                                    <FaBox />
                                )}
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Stok Menipis
                                </p>

                                <h2
                                    className={`text-lg font-semibold transition ${
                                        stokMenipisCount > 0
                                            ? "group-hover:text-red-600"
                                            : "group-hover:text-orange-600"
                                    }`}
                                >
                                    {stokMenipisCount} Produk
                                </h2>
                            </div>
                        </div>

                        {stokMenipisCount > 0 && (
                            <span className="relative z-10 px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                                Perlu Restock
                            </span>
                        )}
                    </div>

                    <div className="group relative bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 w-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative z-10 bg-purple-100 text-purple-600 p-3 rounded-lg group-hover:scale-110 transition duration-300">
                            <FaTags />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm text-gray-500">
                                Kategori Terbanyak
                            </p>
                            <h2 className="text-sm font-semibold group-hover:text-purple-600 transition">
                                {getKategoriTerbanyak()}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-x-auto text-left">
                    <div className="p-4 flex justify-between items-center">
                        <select
                            value={filterKategori}
                            onChange={(e) => {
                                setFilterKategori(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                        >
                            <option value="Semua">Semua Kategori</option>
                            <option value="Makanan">Makanan</option>
                            <option value="Minuman">Minuman</option>
                            <option value="Obat">Obat & Kesehatan</option>
                            <option value="Buku">Buku & Alat tulis</option>
                            <option value="Almamater">Almamater</option>
                        </select>

                        <div className="relative w-64">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 text-sm focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[1000px] whitespace-nowrap p-5">
                            <thead className="bg-gray-100 text-gray-500">
                                <tr className="">
                                    <th className="px-4 py-3 ">No</th>
                                    <th className="px-4 py-3">Nama Produk</th>
                                    <th className="px-4 py-3">Nama Kategori</th>
                                    <th className="px-4 py-3">Harga</th>
                                    <th className="px-4 py-3">Jumlah Stok</th>
                                    <th className="px-4 py-3">Diskon</th>
                                    <th className="px-4 py-3">Deskripsi</th>
                                    <th className="px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, i) => (
                                    <tr
                                        key={item.id_produk}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-gray-400 ">
                                            {indexOfFirstItem + i + 1}
                                        </td>

                                        <td className="border-b border-gray-200 px-4 py-3 ">
                                            <div className="flex items-center gap-3">
                                                <div className=" ">
                                                    {item.gambar?.length > 0 ? (
                                                        <img
                                                            src={`${API_BASE_URL}/storage/${item.gambar[0].url_gambar}`}
                                                            alt={
                                                                item.nama_produk
                                                            }
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                            <FaBox className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="font-medium">
                                                    {item.nama_produk}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="border-b border-gray-200 px-4 py-3 ">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {
                                                            item.kategori
                                                                ?.nama_kategori
                                                        }
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Kategori produk{" "}
                                                        {item.kategori?.nama_kategori?.toLowerCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {item.diskon ? (
                                                <>
                                                    <p className="line-through text-gray-400 text-xs">
                                                        Rp{" "}
                                                        {Number(
                                                            item.harga_jual,
                                                        ).toLocaleString(
                                                            "id-ID",
                                                        )}
                                                    </p>

                                                    <p className="font-bold text-green-600">
                                                        Rp{" "}
                                                        {Number(
                                                            item.harga_setelah_diskon,
                                                        ).toLocaleString(
                                                            "id-ID",
                                                        )}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="font-bold">
                                                    Rp{" "}
                                                    {Number(
                                                        item.harga_jual,
                                                    ).toLocaleString("id-ID")}
                                                </p>
                                            )}
                                        </td>

                                        <td className="border-b border-gray-200 px-4 py-3 ">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs ${
                                                    item.stok <= 5
                                                        ? "bg-red-100 text-orange-600"
                                                        : "bg-green-100 text-green-600"
                                                }`}
                                            >
                                                {item.stok} stok
                                            </span>
                                        </td>

                                        <td className="border-b border-gray-200 px-4 py-3 text-gray-500 ">
                                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                                                {item.diskon?.persen_diskon ??
                                                    0}
                                                %
                                            </span>
                                        </td>

                                        <td className="border-b border-gray-200 px-4 py-3 text-gray-500">
                                            <div
                                                className="max-w-[200px] truncate"
                                                title={item.deskripsi}
                                            >
                                                {item.deskripsi}
                                            </div>
                                        </td>

                                        <td className="border-b border-gray-200 px-4 py-3 ">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
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

                    <Pagination
                        currentItems={currentItems.length}
                        totalItems={products.length}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
            <OpnameStokModal
                showModal={showOpnameModal}
                setShowModal={setShowOpnameModal}
                products={products}
                handleSubmit={handleOpname}
            />

            <ProdukModal
                showModal={showModal}
                setShowModal={setShowModal}
                isEdit={isEdit}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                diskon={diskon}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                handleUploadClick={handleUploadClick}
                fileName={fileName}
            />

            <HapusProdukModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                confirmDelete={confirmDelete}
                selectedDelete={selectedDelete}
            />
        </AppLayout>
    );
}
