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

function App() {
    return (
        <Routes>
            <Route path="/"                   element={<Dashboard />}      />
            <Route path="/dashboard-pengguna" element={<Dashboard />}      />
            <Route path="/dashboard-admin"    element={<DashboardAdmin />} />
            <Route path="/login"              element={<Login />}          />
            <Route path="/produk"             element={<Produk />}         />
            <Route path="/produk/:kategori"   element={<Produk />}         />
            <Route path="/produk/detail/:id"  element={<DetailProduk />}   />
            <Route path="/kelola-produk"      element={<KelolaProduk />}   />
            <Route path="/kelola-kategori"    element={<KelolaKategori />} />
            <Route path="/keranjang"          element={<Keranjang />}      />
            <Route path="/pembayaran"         element={<Pembayaran />}     />
            <Route path="/profil-pengguna"    element={<ProfilPengguna />} />
            <Route path="/profil-admin"       element={<ProfilAdmin />}    />
            <Route path="/edit-profil"        element={<EditProfil />}     />
        </Routes>
    );
}

export default App;