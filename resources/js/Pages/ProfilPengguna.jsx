import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import { FaBell, FaShoppingCart, FaUserCircle,FaCamera,FaIdCard, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ProfilPengguna() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const data = [
  { id: 1, produk: "Roti Tawar" },
  { id: 2, produk: "Teh Botol" },
  { id: 3, produk: "Pulpen Hitam" },
  { id: 4, produk: "Pensil" },
  { id: 5, produk: "Buku Tulis" },
  { id: 6, produk: "Air Mineral" },
];

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 2;

const totalPages = Math.ceil(data.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const currentData = data.slice(startIndex, startIndex + itemsPerPage);
  return (
    <AppLayout role="pengguna">

    <div className="bg-gray-100 min-h-screen">


      {/* Header */}
      <div className="bg-[#2D5A74] text-white p-6 mx-6 mt-6 rounded-t-lg">
        <h2 className="text-lg font-semibold">Halo, Winda! 👋</h2>
        <p className="text-sm">
          Kelola akun dan pantau riwayat belanja kamu di sini
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white mx-6 p-6 rounded shadow flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="bg-green-400 text-white w-16 h-16 flex items-center justify-center rounded">
          <div className="relative w-16 h-16">
  
  {/* Avatar */}
  <div className="bg-green-400 text-white w-16 h-16 flex items-center justify-center rounded">
    WI
  </div>



</div>
</div>
          
          <div className="flex items-center">
        <div>
      <h3 className="font-bold text-lg">Winda</h3>

<div className="mt-2 space-y-2">

  {/* Baris ID & No HP */}
  <div className="flex gap-2 flex-wrap">
    <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full">
      <FaIdCard className="text-gray-600" />
      43425105
    </span>

    <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full">
      <FaPhone className="text-gray-600" />
      08577800000
    </span>
  </div>

  {/* Email */}
  <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full w-fit">
    <FaEnvelope className="text-gray-600" />
    winda@email.ac.id
  </span>

</div>
</div>
</div>
</div>
<button
  className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1"
  onClick={() => navigate("/edit-profil")}
>
  Edit Profil
</button>

      
      </div>
      {/* Statistik */}
      <div className="grid grid-cols-3 gap-4 mx-6 mt-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">18</h2>
          <p className="text-gray-500 text-sm">Total Pesanan</p>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">Rp 247k</h2>
          <p className="text-gray-500 text-sm">Total Belanja</p>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">2</h2>
          <p className="text-gray-500 text-sm">Siap Diambil</p>
        </div>
      </div>

  
  {/* Header*/}
   <div className="mx-6 mt-6 bg-white rounded-xl shadow overflow-hidden">

  {/* Header Table */}
  <div className="p-4 border-b">
    <h2 className="text-lg font-semibold">Riwayat Pesanan</h2>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="px-4 py-2">No</th>
          <th className="px-4 py-2">Produk</th>
          <th className="px-4 py-2">Kategori</th>
          <th className="px-4 py-2">Harga</th>
          <th className="px-4 py-2">Qty</th>
          <th className="px-4 py-2">Tgl Pesan</th>
          <th className="px-4 py-2">Status</th>
        </tr>
      </thead>

      <tbody className="text-gray-700">
        <tr className="border-b hover:bg-gray-50">
          <td className="px-4 py-2">1</td>
          <td>Roti Tawar</td>
          <td>Makanan</td>
          <td>Rp 5.000</td>
          <td>2</td>
          <td>22-03-26</td>
          <td>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
              Selesai
            </span>
          </td>
        </tr>

        <tr className="border-b hover:bg-gray-50">
          <td className="px-4 py-2">2</td>
          <td>Teh Botol</td>
          <td>Minuman</td>
          <td>Rp 4.000</td>
          <td>1</td>
          <td>21-03-26</td>
          <td>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
              Siap Diambil
            </span>
          </td>
        </tr>

        <tr className="border-b hover:bg-gray-50">
          <td className="px-4 py-2">1</td>
          <td>Roti Tawar</td>
          <td>Makanan</td>
          <td>Rp 5.000</td>
          <td>2</td>
          <td>22-03-26</td>
          <td>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
              Belum Bayar
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
    <button className="px-3 py-2 text-sm rounded hover:bg-gray-500 bg-gray-200 ">
      Previous
    </button>

    <div className="flex gap-2">
      <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded">
        1
      </button>
      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
        2
      </button>
      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
        3
      </button>
    </div>

    <button className="px-3 py-2 text-sm rounded hover:bg-gray-500 bg-gray-200">
      Next
    </button>
  </div>

</div>
</div>


    
   
</AppLayout>
  );
}