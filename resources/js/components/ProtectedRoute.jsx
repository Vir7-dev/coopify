import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    let user = null;
    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (e) {
        user = null;
    }

    // Jika belum login sama sekali, lempar ke halaman login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Jika role-nya dibatasi dan role pengguna saat ini tidak sesuai
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Alihkan berdasarkan siapa mereka sebenarnya
        if (user.role === 'admin') {
            return <Navigate to="/dashboard-admin" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
