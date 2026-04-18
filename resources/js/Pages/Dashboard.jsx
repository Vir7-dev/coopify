import React from "react";

function Dashboard() {
    const categories = [
        "Makanan",
        "Minuman",
        "Alat Tulis",
        "Almamater",
        "Obat",
    ];

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
        { name: "Nutirboost", price: "6000" },
    ];

    const stationery = [
        { name: "Pensil", price: "5000" },
        { name: "Pena", price: "3000" },
        { name: "Penggaris", price: "8000" },
        { name: "Penghapus", price: "7000" },
        { name: "Busur", price: "9000" },
        { name: "Kertas HVS", price: "2000" },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">

            {/* BREADCRUMB */}
            <div className="px-10 pt-6 text-sm text-gray-500">
                Beranda • Kategori • Makanan
            </div>

            {/* SEARCH */}
            <div className="px-10 mt-2 flex justify-end">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    className="border rounded-lg px-4 py-2 w-[450]"
                />
            </div>

            {/* BANNER */}
            <div className="px-10 mt-6">
                <div className="bg-white rounded-lg p-6 shadow flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Belanja mudah di Coopify
                        </h2>
                        <p className="text-gray-500">
                            Semua kebutuhan koperasi tersedia
                        </p>
                    </div>

                    <img
                        src="/img/Banner.jpg"
                        alt="Banner"
                        className="w-48"
                    />
                </div>
            </div>

            {/* KATEGORI */}
            <div className="px-10 mt-8 flex justify-center gap-6">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                            🛒
                        </div>

                        <p className="mt-2 text-sm">{cat}</p>
                    </div>
                ))}
            </div>

            {/* PRODUK */}
            <div className="px-10 mt-10">

                <h2 className="text-lg font-semibold mb-4">
                    Makanan
                </h2>

                <div className="grid grid-cols-6 gap-4">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded shadow"
                        >
                            <div className="bg-gray-200 h-20 mb-2"></div>

                            <h3 className="text-sm font-semibold">
                                {product.name}
                            </h3>

                            <p className="text-green-600 text-sm">
                                Rp {product.price}
                            </p>
                        </div>
                    ))}

                </div>

            </div>

            {/* ===== MINUMAN ===== */}
            <div className="px-10 mt-10">

                <h2 className="text-lg font-semibold mb-4">
                    Minuman
                </h2>

                <div className="grid grid-cols-6 gap-4">
                    {drinks.map((drink, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded shadow"
                        >
                            <div className="bg-gray-200 h-20 mb-2"></div>

                            <h3 className="text-sm font-semibold">
                                {drink.name}
                            </h3>

                            <p className="text-green-600 text-sm">
                                Rp {drink.price}
                            </p>
                        </div>
                    ))}
                </div>

             </div>

             {/* ===== Alat tulis ===== */}
            <div className="px-10 mt-10">

                <h2 className="text-lg font-semibold mb-4">
                    Alat tulis
                </h2>

                <div className="grid grid-cols-6 gap-4">
                    {drinks.map((stationery, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded shadow"
                        >
                            <div className="bg-gray-200 h-20 mb-2"></div>

                            <h3 className="text-sm font-semibold">
                                {stationery.name}
                            </h3>

                            <p className="text-green-600 text-sm">
                                Rp {stationery.price}
                            </p>
                        </div>
                    ))}
                </div>

             </div>

      {/* FOOTER */}
<div className="bg-gray-800 text-white mt-16 p-6 text-center">
  <p>Coopify Koperasi Kampus Digital</p>
  <p className="text-sm text-gray-400">
    © 2026 Coopify
  </p>
</div>

</div>
);
}

export default Dashboard;