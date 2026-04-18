import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Components/navbar";
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
}

export default App;