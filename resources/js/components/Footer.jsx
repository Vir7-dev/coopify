import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaUser,
  FaThLarge,
  FaChartBar,
  FaTags,
  FaInfoCircle,
} from "react-icons/fa";

function Footer({ role }) {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const userNavItems = [
    { label: "Home", path: "/", icon: FaHome },
    { label: "Produk", path: "/Produk", icon: FaShoppingBag },
    { label: "Keranjang", path: "/Keranjang", icon: FaShoppingCart },
    { label: "Profil Saya", path: "/profil-pengguna", icon: FaUser },
  ];

  const adminNavItems = [
    { label: "Dashboard", path: "/dashboard-admin", icon: FaChartBar },
    { label: "Kelola Produk", path: "/kelola-produk", icon: FaShoppingBag },
    { label: "Kelola Kategori", path: "/kelola-kategori", icon: FaTags },
    { label: "Profil Saya", path: "/profil-admin", icon: FaUser },
  ];

  const navItems = role === "admin" ? adminNavItems : userNavItems;

  return (
    <footer className="bg-[#2C5F7A] text-white mt-auto">
      {/* MAIN FOOTER - Desktop: 3 columns, Mobile: Stack */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* MOBILE: Brand info on top */}
        <div className="md:hidden mb-6">
          <div
            className="flex items-center gap-2 cursor-pointer mb-3"
            onClick={() => navigate("/")}
          >
            <img src="/img/logo.png" className="w-8 h-8" alt="Logo Coopify" />
            <span className="text-lg font-bold">Coopify</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Platform koperasi online untuk kemudahan bertransaksi & mengelola produk secara online.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">

          {/* KOLOM 1 - BRAND (Desktop only) */}
          <div className="hidden md:block">
            <div
              className="flex items-center gap-2 cursor-pointer mb-3"
              onClick={() => navigate("/")}
            >
              <img src="/img/logo.png" className="w-8 h-8" alt="Logo Coopify" />
              <span className="text-lg font-bold">Coopify</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Platform koperasi online untuk kemudahan bertransaksi & mengelola produk secara online.
            </p>
            {/* Jam Operasional */}
            <div className="flex items-start gap-2">
              <FaClock className="text-[#7EC8E3] mt-0.5 shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white">Jam Operasional</p>
                <p>Senin - Sabtu: 08.00 - 20.00</p>
              </div>
            </div>
          </div>

          {/* KOLOM 2 - NAVIGASI */}
          <div>
            <h3 className="text-sm font-semibold mb-3 border-b border-white/20 pb-2 flex items-center gap-2">
              <FaThLarge className="text-[#7EC8E3]" size={14} />
              Navigasi
            </h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition w-full text-left"
                  >
                    <item.icon size={14} className="shrink-0" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* KOLOM 3 - KONTAK */}
          <div>
            <h3 className="text-sm font-semibold mb-3 border-b border-white/20 pb-2 flex items-center gap-2">
              <FaInfoCircle className="text-[#7EC8E3]" size={14} />
              Hubungi Kami
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-0.5 text-[#7EC8E3] shrink-0" size={14} />
                <span>Jl. Koperasi No. 1, Kota Batam</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-[#7EC8E3] shrink-0" size={14} />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-[#7EC8E3] shrink-0" size={14} />
                <span>coopifypbltrpl@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR - Copyright + Brand */}
      <div className="border-t border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>
            © {currentYear} Coopify. Semua hak dilindungi undang-undang.
          </p>
          <p className="text-[#7EC8E3]">
            Platform Kopi Online
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
