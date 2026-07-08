import React, { useState, useEffect, useRef } from "react";
import { FaBoxes, FaTimes } from "react-icons/fa";

export default function OpnameStokModal({
    showModal,
    setShowModal,
    products,
    handleSubmit,
    isSubmitting = false,
}) {
    const [form, setForm] = useState({
        id_produk: "",
        jumlah_tambah: "",
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!showModal) {
            setForm({
                id_produk: "",
                jumlah_tambah: "",
            });
        }
    }, [showModal]);

    // Klik di luar dropdown akan menutup rekomendasi
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredProducts = products.filter((item) =>
        item.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleSelectProduct = (product) => {
        setForm({
            ...form,
            id_produk: product.id_produk,
        });
        setSearchQuery(product.nama_produk);
        setIsOpen(false);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setIsOpen(true);

        if (value === "") {
            setForm((prev) => ({ ...prev, id_produk: "" }));
        }
    };

    const selectedProduct = products.find(
        (item) => item.id_produk == form.id_produk,
    );

    const stokSistem = selectedProduct?.stok || 0;

    const stokSetelahTambah =
        Number(stokSistem) + Number(form.jumlah_tambah || 0);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2 sm:p-4">
            <div className="bg-white w-full max-w-[400px] max-h-[90vh] overflow-y-auto rounded-[10px] shadow-2xl">
                <div className="bg-[#0099D5] text-white px-5 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FaBoxes className="text-white text-lg" />

                        <h2 className="text-lg font-bold tracking-tight">
                            Opname Stok
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
                     <div className="space-y-1 relative" ref={dropdownRef}>
                        <label className="text-[11px] font-semibold text-gray-500 ml-1">
                            Produk
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari nama produk..."
                                value={searchQuery}
                                onFocus={() => setIsOpen(true)}
                                onChange={handleSearchChange}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none pr-8"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setForm((prev) => ({ ...prev, id_produk: "" }));
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes size={10} />
                                </button>
                            )}
                        </div>
                        {/* List Dropdown Rekomendasi */}
                        {isOpen && (
                            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((item) => (
                                        <div
                                            key={item.id_produk}
                                            onClick={() => handleSelectProduct(item)}
                                            className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 transition-colors ${
                                                item.id_produk === form.id_produk
                                                    ? "bg-blue-50 font-semibold text-[#1D63D3]"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {item.nama_produk}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-xs text-gray-400 text-center">
                                        Produk tidak ditemukan
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-500 ml-1">
                            Stok Sistem
                        </label>

                        <input
                            type="text"
                            disabled
                            value={stokSistem}
                            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-500 ml-1">
                            Jumlah Tambah Stok
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={form.jumlah_tambah}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    jumlah_tambah: e.target.value,
                                })
                            }
                            placeholder="Masukkan jumlah stok"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-[11px] font-semibold text-gray-500">
                            Stok Setelah Ditambah
                        </p>

                        <h3 className="text-xl font-bold text-[#1D63D3]">
                            {stokSetelahTambah}
                        </h3>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => handleSubmit(form)}
                            disabled={isSubmitting}
                            className="flex-1 bg-[#1D63D3] hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </button>

                        <button
                            onClick={() => setShowModal(false)}
                            disabled={isSubmitting}
                            className="flex-1 bg-[#0099D5] hover:bg-[#0088C0] text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
