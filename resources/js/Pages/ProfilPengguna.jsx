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


 <button
    onClick={() => setShowModal(true)}
    className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
  >
    <FaCamera size={12} className="text-gray-700" />
  </button>
</div>
</div>
          
          <div className="flex items-center">
        <div>
      <h3 className="font-bold text-lg">Winda</h3>

<div className="text-sm text-gray-500 ">
  <p className="flex items-center gap-2">
    <FaIdCard /> NIM: 434234235
  </p>
  <p className="flex items-center gap-2">
    <FaPhone /> 08123456789
  </p>
  <p className="flex items-center gap-2">
    <FaEnvelope /> winda@mail.com
  </p>
</div>
</div>
</div>
</div>
<button
  className="bg-green-500 text-white px-3 py-2 rounded text-sm cursor-pointer hover:scale-110 transition"
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

      {/* Riwayat Pembelian */}
     <div className="bg-white mx-6 mb-6 rounded-lg shadow overflow-hidden mt-6">
  
  {/* Header Biru */}
  <div className="bg-[#2D8CA8] text-white px-4 py-3 flex justify-between items-center">
    <h3 className="font-semibold flex items-center gap-2">
      📄 Riwayat Pembelian
    </h3>
</div>
  {/* Table */}
  <div className="p-4">
    <table className="w-full text-sm">
      
      {/* Head */}
      <thead className="text-gray-600 border-b">
        <tr>
          <th className="py-2 text-left">No</th>
          <th className="text-left">Produk</th>
          <th className="text-left">Kategori</th>
          <th className="text-left">Harga</th>
          <th className="text-left">Qty</th>
          <th className="text-left">Tgl Pesan</th>
          <th className="text-left">Status</th>
        </tr>
      </thead>

      {/* Body */}
      <tbody className="text-gray-700">
        
        <tr className="border-b hover:bg-gray-50">
          <td className="py-2">1.</td>
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
          <td className="py-2">2.</td>
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
          <td className="py-2">3.</td>
          <td>Pulpen Hitam</td>
          <td>Alat Tulis</td>
          <td>Rp 3.500</td>
          <td>5</td>
          <td>19-03-26</td>
          <td>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
              Belum Diambil
            </span>
          </td>
        </tr>

        <tr className="hover:bg-gray-50">
          <td className="py-2">4.</td>
          <td>Pensil</td>
          <td>Alat Tulis</td>
          <td>Rp 3.000</td>
          <td>3</td>
          <td>18-03-26</td>
          <td>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
              Selesai
            </span>
          </td>
        </tr>



      </tbody>
    </table>
  </div>
  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
  
  {/* Mobile */}
  <div className="flex flex-1 justify-between sm:hidden">
    <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
      Previous
    </button>
    <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
      Next
    </button>
  </div>

  {/* Desktop */}
  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    


    {/* Pagination */}
    <div>
      <nav
        aria-label="Pagination"
        className="isolate inline-flex -space-x-px rounded-md shadow-xs"
      >
        
        {/* Prev */}
        <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-300 hover:bg-gray-50">
          <span className="sr-only">Previous</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Pages */}
        <button className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          1
        </button>

        <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50">
          2
        </button>

        <button className="relative hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50">
          3
        </button>

        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
          ...
        </span>

        <button className="relative hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50">
          8
        </button>

        <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50">
          9
        </button>

        <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50">
          10
        </button>

        {/* Next */}
        <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-300 hover:bg-gray-50">
          <span className="sr-only">Next</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>

      </nav>
    </div>
  </div>
</div>
</div>
</div>

    
   
</AppLayout>
  );
}