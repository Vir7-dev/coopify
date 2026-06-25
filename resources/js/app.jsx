import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CartFlyZone from "./components/CartFlyZone";

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
import Search from "./Pages/Search";
import PesananMasuk from "./Pages/PesananMasuk";
import ProtectedRoute from "./components/ProtectedRoute";

// Scroll to top on route change
function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname, location.search]);

    return null;
}

function App() {
    useEffect(() => {
        const loginTime = localStorage.getItem('login_time');
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token && loginTime) {
            if (user?.role === 'admin') {
                const DURASI_ADMIN = 12 * 60 * 60 * 1000; // 12 jam
                if (Date.now() - loginTime > DURASI_ADMIN) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('login_time');
                    window.location.href = '/login';
                }
            } else {
                const DURASI_PENGGUNA = 4 * 60 * 60 * 1000; // 4 jam
                if (Date.now() - loginTime > DURASI_PENGGUNA) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('login_time');
                    window.location.href = '/';
                }
            }
        }
    }, []);

    return (
        <CartProvider>
            <CartFlyZone>
                <ScrollToTop />
                <Routes>
                    {/* Auth & Public */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Produk (Public) */}
                    <Route path="/produk" element={<Produk />} />
                    <Route path="/produk/:kategori" element={<Produk />} />
                    <Route path="/detail-produk/:id" element={<DetailProduk />} />
                    <Route path="/search" element={<Search />} />

                    {/* Rute Khusus Admin */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                        <Route path="/pesanan-masuk" element={<PesananMasuk />} />
                        <Route path="/kelola-produk" element={<KelolaProduk />} />
                        <Route path="/kelola-kategori" element={<KelolaKategori />} />
                        <Route path="/profil-admin" element={<ProfilAdmin />} />
                    </Route>

                    {/* Rute Khusus Pengguna */}
                    <Route element={<ProtectedRoute allowedRoles={['pengguna']} />}>
                        <Route path="/dashboard-pengguna" element={<Dashboard />} />
                        <Route path="/keranjang" element={<Keranjang />} />
                        <Route path="/pembayaran" element={<Pembayaran />} />
                        <Route path="/profil-pengguna" element={<ProfilPengguna />} />
                        <Route path="/edit-profil" element={<EditProfil />} />
                    </Route>
                </Routes>
            </CartFlyZone>
        </CartProvider>
    );
}

export default App;
