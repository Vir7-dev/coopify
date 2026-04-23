import React from "react";
import Navbar from "../Components/Navbar";

export default function AppLayout({ children, role, showNavbar = true }) {
    return (
        <div className="w-full min-h-screen bg-gray-100">

            {showNavbar && <Navbar role={role} />}

            <div className="w-full px-6 py-6">
                {children}
            </div>
        </div>
    );
}