import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KelolaProduk from "./Pages/KelolaProduk";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <Router>

      {window.location.pathname !== "/" && <Navbar role="" />}

      <div className="p-10">

        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/kelola-produk" element={<KelolaProduk />} />

        </Routes>

      </div>
    </Router>
  );
import KelolaKategori from "./Pages/KelolaKategori";
import ProfilPengguna from "./Pages/ProfilPengguna";
import EditProfil from "./Pages/EditProfil";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<KelolaKategori />} />
                <Route path="/kelola-produk" element={<KelolaProduk />} />
                <Route path="/kelola-kategori" element={<KelolaKategori />} />
                <Route path="/profil-pengguna" element={<ProfilPengguna />} />
                <Route path="/edit-profil" element={<EditProfil />} />
            </Routes>
        </Router>
    );
}

export default App;}