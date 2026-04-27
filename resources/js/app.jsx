import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KelolaProduk from "./Pages/KelolaProduk";
import KelolaKategori from "./Pages/KelolaKategori";
import ProfilPengguna from "./Pages/ProfilPengguna";
import EditProfil from "./Pages/EditProfil";
import Produk from "./Pages/Produk";
import Login from "./Pages/Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/kelola-produk" element={<KelolaProduk />} />
                <Route path="/kelola-kategori" element={<KelolaKategori/>} />
                <Route path="/profil-pengguna" element={<ProfilPengguna />} />
                <Route path="/edit-profil" element={<EditProfil />} />
                <Route path="/produk" element={<Produk />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
