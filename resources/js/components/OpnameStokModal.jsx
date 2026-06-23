import React, { useState, useEffect } from "react";
import { FaBoxes, FaTimes } from "react-icons/fa";

export default function OpnameStokModal({
    showModal,
    setShowModal,
    products,
    handleSubmit,
}) {
    const [form, setForm] = useState({
        id_produk: "",
        jumlah_tambah: "",
    });

    useEffect(() => {
        if (!showModal) {
            setForm({
                id_produk: "",
                jumlah_tambah: "",
            });
        }
    }, [showModal]);

    const selectedProduct = products.find(
        (item) => item.id_produk == form.id_produk,
    );

    const stokSistem = selectedProduct?.stok || 0;

    const stokSetelahTambah =
        Number(stokSistem) + Number(form.jumlah_tambah || 0);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-[400px] rounded-[10px] shadow-2xl overflow-hidden">

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

                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-gray-500 ml-1">
                            Produk
                        </label>

                        <select
                            value={form.id_produk}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    id_produk: e.target.value,
                                })
                            }
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                        >
                            <option value="">Pilih Produk</option>

                            {products.map((item) => (
                                <option
                                    key={item.id_produk}
                                    value={item.id_produk}
                                >
                                    {item.nama_produk}
                                </option>
                            ))}
                        </select>
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
    );
}
