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
import DashboardAdmin from "./Pages/DashboardAdmin";
import Dashboard from "./Pages/Dashboard";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard-pengguna" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/produk/:kategori" element={<Produk />} />
            <Route path="/kelola-produk" element={<KelolaProduk />} />
            <Route path="/kelola-kategori" element={<KelolaKategori />} />
            <Route path="/keranjang" element={<Keranjang />} />
            <Route path="/pembayaran" element={<Pembayaran />} />
            <Route path="/profil-pengguna" element={<ProfilPengguna />} />
            <Route path="/profil-admin" element={<ProfilAdmin />} />
            <Route path="/edit-profil" element={<EditProfil />} />
            <Route path="/produk" element={<Produk />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />

            <Route path="*" element={<Dashboard />} />
        </Routes>
    );
}

export default App;
