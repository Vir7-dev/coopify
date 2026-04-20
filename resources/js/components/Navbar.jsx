import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaUserCircle, FaBell, FaShoppingCart } from "react-icons/fa";

function Navbar({ role }) {
  const navigate = useNavigate(); // 

  return (
    <nav className="flex justify-between items-center px-10 py-2.5 bg-[#3F7EA2] text-white font-sans shadow-md">

      {/* LOGO */}
      <div className="flex items-center gap-2.5">
        <img
          src="/img/logo.png"
          alt="Coopify Logo"
          className="w-10 h-10 object-contain"
        />
        <span className="text-2xl font-bold">Coopify</span>
      </div>

      {/* MENU */}
      <ul className="flex list-none gap-[30px] m-0 p-0">
        <li 
          onClick={() => navigate("/")}
          className="cursor-pointer text-base hover:text-green-100 transition"
        >
          Home
        </li>

        <li 
          onClick={() => navigate("/kategori")}
          className="cursor-pointer text-base hover:text-green-100 transition"
        >
          Kategori Produk
        </li>

        <li 
          onClick={() => navigate("/kontak")}
          className="cursor-pointer text-base hover:text-green-100 transition"
        >
          Hubungi
        </li>
      </ul>

      {/* ICON */}
      <div className="flex items-center gap-5 text-xl">
        {role === 'admin' ? (
          <FaCheckCircle className="text-xl cursor-pointer hover:scale-110 transition" />
        ) : (
          <>
            <FaBell className="text-xl cursor-pointer hover:scale-110 transition" />
            <FaShoppingCart className="text-xl cursor-pointer hover:scale-110 transition" />
          </>
        )}

        
        <FaUserCircle 
          className="text-2xl cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("")}
        />
      </div>

    </nav>
  );
}

export default Navbar;