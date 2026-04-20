import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KelolaKategori from "./Pages/KelolaKategori";
import ProfilPengguna from "./Pages/ProfilPengguna";
import EditProfil from "./Pages/EditProfil";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/kelola-produk" element={<KelolaProduk />} />
                <Route path="/kelola-kategori" element={<KelolaKategori />} />
                <Route path="/profil-pengguna" element={<ProfilPengguna />} />
                <Route path="/edit-profil" element={<EditProfil />} />
            </Routes>
        </Router>
    );
}

export default App;