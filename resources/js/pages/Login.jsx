import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import api from "../api";


function Login() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: false,
    customClass: {
      popup: "!rounded-4xl !border-2 !border-[#2D5A74] !shadow-lg",
    },
  });

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", {
        nim_nik: nim,
        password: password,
      });
      const data = res.data;

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("login_time", Date.now());

      Toast.fire({
        icon: "success",
        title: "Login berhasil!",
      });

      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "/dashboard-admin";
        } else {
          window.location.href = "/dashboard-pengguna";
        }
      }, 1500);
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "Login gagal",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">

      {/* LEFT */}
      <div className="w-full lg:w-1/2 min-h-screen bg-[#2D5A74] flex flex-col justify-center px-8 sm:px-12 lg:px-16 text-white">

        {/* LOGO */}
        <div className="flex items-center gap-4 mb-10 -mt-8">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="w-14 h-14 sm:w-16 sm:h-16"
          />
          <h2 className="text-2xl sm:text-3xl font-bold">
            Coopify
          </h2>
        </div>

        {/* TEXT */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Selamat datang!
        </h1>

        <p className="text-sm sm:text-base text-gray-300 mb-8">
          Masuk ke akun anda untuk memulai belanja
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* NIM */}
          <label className="text-sm mb-1 block">
            NIM / NIK
          </label>

          <input
            type="text"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-white text-black outline-none"
            placeholder="Masukkan NIM / NIK"
          />

          {/* PASSWORD */}
          <label className="text-sm mb-1 block">
            Kata Sandi
          </label>

          <div className="flex bg-white rounded-lg mb-6 overflow-hidden">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 p-3 text-black outline-none"
              placeholder="Masukkan Kata Sandi"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-4 text-gray-500 hover:text-black flex items-center"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#2D5A74] text-white py-3 rounded-lg border-2 border-white font-semibold hover:scale-95 transition"          >
            Masuk
          </button>

        </form>

        <p className="mt-8 text-xs text-gray-300 text-center">
          Coopify 2026
        </p>

      </div>

      {/* RIGHT */}
      <div
        className="hidden lg:flex lg:w-1/2 h-screen relative items-center justify-end"
        style={{
          backgroundImage: "url('/img/login.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

    </div>
  );
}

export default Login;