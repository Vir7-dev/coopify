import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RedirectAdminRoute = () => {
    const userString = localStorage.getItem('user');

    if (userString) {
        try {
            const user = JSON.parse(userString);
            // Jika user adalah admin, cegah akses ke halaman publik/pengguna
            if (user && user.role === 'admin') {
                return <Navigate to="/dashboard-admin" replace />;
            }
        } catch (e) {
            // Abaikan error parse
        }
    }

    return <Outlet />;
};

export default RedirectAdminRoute;
