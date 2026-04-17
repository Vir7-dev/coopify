import React from "react";
import Navbar from "../Components/Navbar";

export default function AppLayout({ children }) {
    return (
        <div className="w-full min-h-screen bg-gray-100">
           
            {/* Content FULL WIDTH */}
            <div className="w-full px-6 py-6">{children}</div>
        </div>
    );
}
