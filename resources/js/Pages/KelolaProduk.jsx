import React from "react";
import AppLayout from "../Layouts/AppLayout";

export default function Index() {
  const products = Array(7).fill({
    nama: "Tolak Angin",
    kategori: "Obat",
    harga: "Rp 2.000",
    stok: 20,
    tgl: "20-04-2026",
  });

  return (
    <AppLayout>
      <div className="w-full">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Kelola Produk
            </h1>
            <p className="text-sm text-gray-500">
              Manajemen produk koperasi
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow text-sm">
              + Tambahkan Produk
            </button>

            <input
              type="text"
              placeholder="Cari makanan..."
              className="px-4 py-2 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow w-full overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Produk</th>
                <th className="p-3 text-left">Gambar</th>
                <th className="p-3 text-left">Kategori</th>
                <th className="p-3 text-left">Harga</th>
                <th className="p-3 text-left">Stok</th>
                <th className="p-3 text-left">Tgl Kadaluarsa</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.nama}</td>

                  <td className="p-3">
                    <img
                      src="/images/produk.jpg"
                      alt=""
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>

                  <td className="p-3">{item.kategori}</td>
                  <td className="p-3">{item.harga}</td>
                  <td className="p-3">{item.stok}</td>
                  <td className="p-3">{item.tgl}</td>

                  <td className="p-3 flex gap-2">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs">
                      Edit
                    </button>

                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end items-center gap-2 p-4 text-sm">
            <button className="px-3 py-1 bg-gray-200 rounded">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 bg-gray-200 rounded">
              2
            </button>
            <button className="px-3 py-1 bg-gray-200 rounded">
              3
            </button>
            <button className="px-3 py-1 bg-gray-200 rounded">
              Next
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
