import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Components/navbar";
import KelolaProduk from "./Pages/KelolaProduk";

function App() {
    return (
        <Router>
            <Navbar role="" />

            <div className="p-10">
                <Link to="/kelola-produk"></Link>

                <Routes>
                    <Route path="/kelola-produk" element={<KelolaProduk />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
