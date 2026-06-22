import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AppLayout({ children, role, showNavbar = true, showFooter = true }) {
    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col">

            {showNavbar && <Navbar role={role} />}

            <div className="w-full px-6 py-6">
                {children}
            </div>
              {showFooter && <Footer role={role} />}
        </div>
    );
}
