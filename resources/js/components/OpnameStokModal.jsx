import React, { useState } from "react";

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

    const selectedProduct = products.find(
        (item) => item.id_produk == form.id_produk,
    );

    const stokSistem = selectedProduct?.stok || 0;
    const stokSetelahTambah =
    Number(stokSistem) + Number(form.jumlah_tambah || 0);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-xl shadow-lg">

                <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">
                        Opname Stok
                    </h2>
                    <p className="text-sm text-gray-500">
                       Tambahkan stok produk yang baru 
                    </p>
                </div>

                <div className="p-6 space-y-4">

                    <div>
                        <label className="text-xs font-medium text-gray-500">
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
                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                        >
                            <option value="">
                                Pilih Produk
                            </option>

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

                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Stok Sistem
                        </label>

                        <input
                            type="text"
                            disabled
                            value={stokSistem}
                            className="w-full mt-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Jumlah Tambah Stok
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={form.jumlah_tambah}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    jumlah_tambah: e.target.value,
                                })
                            }
                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2"
                            placeholder="Masukkan jumlah stok yang ditambahkan"
                        />
                    </div>

                   <div className="bg-green-50 border border-green-100 rounded-lg p-4">
    <p className="text-sm text-gray-600">
        Stok Setelah Ditambah
    </p>

    <h3 className="font-semibold text-green-600">
        {stokSetelahTambah}
    </h3>
</div>

                </div>

                <div className="border-t px-6 py-4 flex justify-end gap-2">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        Batal
                    </button>

                    <button
                        onClick={() => handleSubmit(form)}
                        className="px-4 py-2 bg-[#1766D3] hover:bg-[#3D8FFF] text-white rounded-lg"
                    >
                        Simpan Opname
                    </button>
                </div>
            </div>
        </div>
    );
}
