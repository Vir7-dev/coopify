import React from "react";
import AppLayout from "../Layouts/AppLayout";

function Dashboard() {

    const products = [
        { name: "Roti", price: "5000" },
        { name: "Susu", price: "8000" },
        { name: "Pulpen", price: "3000" },
        { name: "Buku", price: "10000" },
        { name: "Snack", price: "7000" },
        { name: "Pensil", price: "2000" },
    ];

    const drinks = [
        { name: "Teh Botol", price: "5000" },
        { name: "Air Mineral", price: "3000" },
        { name: "Jus Jeruk", price: "8000" },
        { name: "Kopi", price: "7000" },
        { name: "Susu Coklat", price: "9000" },
        { name: "NutriBoost", price: "6000" },
    ];

    const stationery = [
        { name: "Pensil", price: "5000" },
        { name: "Pena", price: "3000" },
        { name: "Penggaris", price: "8000" },
        { name: "Penghapus", price: "7000" },
        { name: "Busur", price: "9000" },
        { name: "Kertas HVS", price: "2000" },
    ];

    const drug = [
        { name: "Panadol", price: "5000" },
        { name: "Amoxicillin", price: "3000" },
        { name: "Bromhexine", price: "8000" },
        { name: "Captopril", price: "7000" },
        { name: "Promag", price: "9000" },
        { name: "Inhaler", price: "2000" },
    ];

    const categories = [
        { title: "Makanan", data: products },
        { title: "Minuman", data: drinks },
        { title: "Alat Tulis", data: stationery },
        { title: "Obat", data: drug },
    ];

    return (
        <AppLayout>

        <div className="bg-gray-100 min-h-screen pb-24">

            <div className="px-10 pt-6 text-sm text-gray-500">
                Beranda • Kategori • Produk
            </div>

            <div className="px-10 mt-4 flex justify-end">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    className="border rounded-lg px-4 py-2 w-[450px]"
                />
            </div>

            <div className="px-10 mt-14">
                <div className="border rounded-xl overflow-hidden bg-gray-200">
                    <img
                        src="/img/Banner.jpg"
                        alt="banner"
                        className="w-full h-[240px] object-cover"
                    />
                </div>
            </div>

            <div className="px-10 mt-20 flex justify-center gap-12">
                {categories.map((cat, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-xl">
                            🛒
                        </div>

                        <p className="mt-3 text-sm font-medium">
                            {cat.title}
                        </p>
                    </div>
                ))}
            </div>

            {categories.map((cat, index) => (
                <div className="px-10 mt-20" key={index}>

                    <div className="bg-gray-200 rounded-xl p-6">

                        <div className="bg-gradient-to-r from--400 to-blue-500 text-black font-semibold px-4 py-2 rounded-lg mb-6">
                            {cat.title}
                        </div>

                        <div className="grid grid-cols-6 gap-6">

                            {cat.data.map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                                >

                                    <div className="bg-gray-200 h-24 mb-3 rounded"></div>

                                    <h3 className="text-sm font-semibold">
                                        {item.name}
                                    </h3>

                                    <p className="text-green-600 text-sm">
                                        Rp {item.price}
                                    </p>

                                    <button className="bg-green-500 text-white text-xs px-3 py-1 rounded mt-3 w-full hover:bg-green-600">
                                        🛒 Tambah
                                    </button>

                                </div>
                            ))}

                        </div>

                    </div>

                </div>
            ))}

            <div className="bg-gray-800 text-white mt-24 p-6 text-center">
                <p className="font-semibold">Coopify Koperasi Kampus Digital</p>
                <p className="text-sm text-gray-400">
                    © 2026 Coopify
                </p>
            </div>

        </div>

        </AppLayout>
    );
}

export default Dashboard;