import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KelolaProduk from "./Pages/KelolaProduk";
import KelolaKategori from "./Pages/KelolaKategori";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<KelolaKategori />} />
                <Route path="/kelola-produk" element={<KelolaProduk />} />
                <Route path="/kelola-kategori" element={<KelolaKategori />} />
            </Routes>
        </Router>
    );
}

export default App;