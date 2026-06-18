import React from "react";
import { Routes, Route } from "react-router-dom";

import KelolaProduk from "./Pages/KelolaProduk";
import KelolaKategori from "./Pages/KelolaKategori";
import Keranjang from "./Pages/Keranjang";
import Pembayaran from "./Pages/Pembayaran";
import ProfilPengguna from "./Pages/ProfilPengguna";
import ProfilAdmin from "./Pages/ProfilAdmin";
import EditProfil from "./Pages/EditProfil";
import Produk from "./Pages/Produk";
import Login from "./Pages/Login";
import DetailProduk from "./Pages/DetailProduk";
import DashboardAdmin from "./Pages/DashboardAdmin";
import Dashboard from "./Pages/Dashboard";
import Search from "./Pages/Search"; // pastikan file Search.jsx ada

function App() {
    return (
        <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard-pengguna" element={<Dashboard />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Produk */}
            <Route path="/produk" element={<Produk />} />
            <Route path="/produk/:kategori" element={<Produk />} />
            <Route path="/detail-produk/:id" element={<DetailProduk />} />
            <Route path="/search" element={<Search />} />

            {/* Admin */}
            <Route path="/kelola-produk" element={<KelolaProduk />} />
            <Route path="/kelola-kategori" element={<KelolaKategori />} />

            {/* Transaksi */}
            <Route path="/keranjang" element={<Keranjang />} />
            <Route path="/pembayaran" element={<Pembayaran />} />

            {/* Profil */}
            <Route path="/profil-pengguna" element={<ProfilPengguna />} />
            <Route path="/profil-admin" element={<ProfilAdmin />} />
            <Route path="/edit-profil" element={<EditProfil />} />
<<<<<<< HEAD
            <Route path="/produk" element={<Produk />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            <Route path="/ubah-sandi" element={<UbahSandi />} />




=======
>>>>>>> 6542abf70738f9fd6a1ff37abb05c22f5eea2168
        </Routes>
    );
}

export default App;