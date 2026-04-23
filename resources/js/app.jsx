import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KelolaProduk from "./Pages/KelolaProduk";
import KelolaKategori from "./Pages/KelolaKategori";
import Keranjang from "./Pages/Keranjang";
import Pembayaran from "./Pages/Pembayaran";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<KelolaKategori />} />
                <Route path="/kelola-produk" element={<KelolaProduk />} />
                <Route path="/kelola-kategori" element={<KelolaKategori />} />
                <Route path="/keranjang" element={<Keranjang />} />
                <Route path="/pembayaran" element={<Pembayaran />} />
            </Routes>
        </Router>
    );
}

export default App;