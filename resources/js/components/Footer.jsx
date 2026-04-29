import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

function Footer({ role }) {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2C5F7A] text-white">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* KOLOM 1 - BRAND */}
        <div>
          <div
            className="flex items-center gap-2 cursor-pointer mb-4"
            onClick={() => navigate("/")}
          >
            <img src="/img/logo.png" className="w-9 h-9" alt="Logo Coopify" />
            <span className="text-xl font-bold">Coopify</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Platform koperasi digital yang memudahkan anggota dalam bertransaksi,
            mengelola produk, dan mengakses layanan koperasi secara online.
          </p>
          {/* SOSIAL MEDIA */}
          <div className="flex gap-3 mt-5">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="https://www.instagram.com/coopify.app/"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition"
            >
              <FaInstagram size={14} />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition"
            >
              <FaTwitter size={14} />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition"
            >
              <FaWhatsapp size={14} />
            </a>
          </div>
        </div>

        {/* KOLOM 2 - NAVIGASI */}
        <div>
          <h3 className="font-semibold text-base mb-4 border-b border-white/20 pb-2">
            Navigasi
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {role === "admin" ? (
              <>
                <li
                  onClick={() => navigate("/dashboard-admin")}
                  className="cursor-pointer hover:text-white transition"
                >
                  Dashboard
                </li>
                <li
                  onClick={() => navigate("/kelola-produk")}
                  className="cursor-pointer hover:text-white transition"
                >
                  Kelola Produk
                </li>
                <li
                  onClick={() => navigate("/kelola-kategori")}
                  className="cursor-pointer hover:text-white transition"
                >
                  Kelola Kategori
                </li>
                <li
                  onClick={() => navigate("/profil-admin")}
                  className="cursor-pointer hover:text-white transition"
                >
                  Profil Saya
                </li>
              </>
            ) : (
              <>
                <li
                  onClick={() => navigate("/")}
                  className="cursor-pointer hover:text-white transition"
                >
                  Home
                </li>
                <li
                  onClick={() => navigate("/Produk")}
                  className="cursor-pointer hover:text-white transition"
                >
                  Produk
                </li>
                <li
                  onClick={() => navigate("/Keranjang")}
                  className="cursor-pointer hover:text-white transition"
                >
                  Keranjang
                </li>
                <li onClick={() => navigate("/profil-pengguna")} className="cursor-pointer hover:text-white transition">
                  Profil Saya
                </li>
              </>
            )}
          </ul>
        </div>

        {/* KOLOM 3 - KONTAK */}
        <div>
          <h3 className="font-semibold text-base mb-4 border-b border-white/20 pb-2">
            Hubungi Kami
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-0.5 text-[#7EC8E3] shrink-0" />
              <span>Jl. Koperasi No. 1, Kota Batam, Indonesia</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#7EC8E3] shrink-0" />
              <span>+62 812-3456-7890</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-[#7EC8E3] shrink-0" />
              <span>info@coopify.id</span>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-center text-xs text-gray-400">
          © {currentYear} Coopify. Semua hak dilindungi undang-undang.
        </p>
      </div>
    </footer>
  );
}

export default Footer;