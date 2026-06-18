import React, { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Keranjang() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKeranjang();
    }, []);

    const fetchKeranjang = async () => {
        try {
            const res = await axios.get("/api/keranjang", {
                withCredentials: true,
            });

            setItems(
                res.data.map((item) => ({
                    ...item,
                    checked: true,
                })),
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = (id) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id_keranjang === id
                    ? {
                          ...item,
                          checked: !item.checked,
                      }
                    : item,
            ),
        );
    };

    const toggleAll = (checked) => {
        setItems((prev) =>
            prev.map((item) => ({
                ...item,
                checked,
            })),
        );
    };

    const allChecked = items.length > 0 && items.every((item) => item.checked);

    const noneChecked = items.every((item) => !item.checked);

    const checkedItems = items.filter((item) => item.checked);

    const total = checkedItems.reduce(
        (sum, item) =>
            sum + Number(item.produk.harga_jual) * item.jml_dikeranjang,
        0,
    );

    const updateQty = async (idKeranjang, qty) => {
        if (qty < 1) return;

        try {
            await axios.put(
                `/api/keranjang/${idKeranjang}`,
                {
                    jumlah: qty,
                },
                {
                    withCredentials: true,
                },
            );

            fetchKeranjang();
        } catch (err) {
            console.error(err);
        }
    };

    const hapusItem = async (idKeranjang) => {
        if (!confirm("Hapus item dari keranjang?")) {
            return;
        }

        try {
            await axios.delete(`/api/keranjang/${idKeranjang}`, {
                withCredentials: true,
            });

            fetchKeranjang();
        } catch (err) {
            console.error(err);
        }
    };

    const checkout = async () => {
        if (checkedItems.length === 0) return;
        try {
            const res = await axios.post(
                "/api/checkout",
                {
                    items: checkedItems.map((item) => item.id_keranjang),
                },
                { withCredentials: true },
            );
            navigate("/pembayaran", {
                state: { kode_pesanan: res.data.kode_pesanan },
            });
        } catch (err) {
            alert(err.response?.data?.message || "Checkout gagal");
        }
    };

    const formatRupiah = (angka) => {
        return "Rp " + Number(angka).toLocaleString("id-ID");
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="p-6">Memuat keranjang...</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

                {items.length === 0 ? (
                    <div className="bg-white rounded-xl p-10 text-center shadow">
                        <p className="text-gray-500">Keranjang masih kosong</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow">
                                <div className="p-4 border-b flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        ref={(el) => {
                                            if (el) {
                                                el.indeterminate =
                                                    !allChecked && !noneChecked;
                                            }
                                        }}
                                        onChange={(e) =>
                                            toggleAll(e.target.checked)
                                        }
                                    />

                                    <span>Pilih Semua</span>
                                </div>

                                {items.map((item) => (
                                    <div
                                        key={item.id_keranjang}
                                        className="p-4 border-b"
                                    >
                                        <div className="flex gap-4">
                                            <input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={() =>
                                                    toggleItem(
                                                        item.id_keranjang,
                                                    )
                                                }
                                            />

                                            <img
                                                src={
                                                    item.produk?.gambar?.length
                                                        ? `${BASE_URL}/storage/${item.produk.gambar[0].url_gambar}`
                                                        : "/img/no-image.png"
                                                }
                                                alt={item.produk.nama_produk}
                                                className="w-24 h-24 object-cover rounded-lg border"
                                            />

                                            <div className="flex-1">
                                                <h3 className="font-semibold">
                                                    {item.produk.nama_produk}
                                                </h3>

                                                <p className="text-blue-600 font-bold mt-1">
                                                    {formatRupiah(
                                                        item.produk.harga_jual,
                                                    )}
                                                </p>

                                                <div className="flex items-center gap-2 mt-4">
                                                    <button
                                                        onClick={() =>
                                                            updateQty(
                                                                item.id_keranjang,
                                                                item.jml_dikeranjang -
                                                                    1,
                                                            )
                                                        }
                                                        className="px-3 py-1 border rounded"
                                                    >
                                                        -
                                                    </button>

                                                    <span>
                                                        {item.jml_dikeranjang}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQty(
                                                                item.id_keranjang,
                                                                item.jml_dikeranjang +
                                                                    1,
                                                            )
                                                        }
                                                        className="px-3 py-1 border rounded"
                                                    >
                                                        +
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            hapusItem(
                                                                item.id_keranjang,
                                                            )
                                                        }
                                                        className="ml-auto text-red-500"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="bg-white rounded-xl shadow p-5 sticky top-4">
                                <h2 className="font-semibold text-lg mb-4">
                                    Ringkasan Belanja
                                </h2>

                                <div className="flex justify-between mb-2">
                                    <span>Total Item</span>

                                    <span>{checkedItems.length}</span>
                                </div>

                                <div className="flex justify-between mb-4">
                                    <span>Total</span>

                                    <span className="font-bold text-blue-600">
                                        {formatRupiah(total)}
                                    </span>
                                </div>

                                <button
                                    onClick={checkout}
                                    disabled={checkedItems.length === 0}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
