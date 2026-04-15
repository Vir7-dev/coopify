import React from 'react';
import { FaCheckCircle, FaUserCircle, FaBell, FaShoppingCart } from "react-icons/fa";

function Navbar({ role }) {
  return (
    <nav className="flex justify-between items-center px-10 py-2.5 bg-gradient-to-r from-[#4ade80] to-[#3b82f6] text-white font-sans shadow-md">

      <div className="flex items-center gap-2.5">
        <img
          src="/img/logo.png"
          alt="Coopify Logo"
          className="w-10 h-10 object-contain"
        />
        <span className="text-2xl font-bold">Coopify</span>
      </div>

      <ul className="flex list-none gap-[30px] m-0 p-0 font-medium">
        <li className="cursor-pointer text-base hover:text-green-100 transition">Home</li>
        <li className="cursor-pointer text-base hover:text-green-100 transition">Kategori Produk</li>
        <li className="cursor-pointer text-base hover:text-green-100 transition">Hubungi</li>
      </ul>


      <div className="flex items-center gap-5 text-xl">
        {role === 'admin' ? (
          <FaCheckCircle className="text-xl cursor-pointer hover:scale-110 transition" />
        ) : (
          <>
            <FaBell className="text-xl cursor-pointer hover:scale-110 transition" />
            <FaShoppingCart className="text-xl cursor-pointer hover:scale-110 transition" />
          </>
        )}
        <FaUserCircle className="text-2xl cursor-pointer hover:scale-110 transition" />
      </div>
    </nav>
  );
}

export default Navbar;
