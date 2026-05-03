import React, { useState } from 'react'
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [nim, setNim] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nim_nik: nim,
          password: password,
        }),
      })

      const text = await res.text()
      const data = JSON.parse(text)

      if (res.ok) {
        setMessage("✅ Login berhasil")
      } else {
        setMessage("❌ " + data.message)
      }

    } catch {
      setMessage("❌ Masukan Nama Pengguna dan Kata sandi")
    }
  }

  return (
    <div className="h-screen w-full flex overflow-hidden">

      {/* LEFT */}
      <div className="w-1/2 h-full bg-[#2D5A74] flex flex-col justify-center px-20 text-white">

        <div className="flex items-center gap-3 mb-4">
          <img src="/img/logo.png" className="w-12 h-12" />
          <h2 className="text-2xl font-bold">Coopify</h2>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          Selamat datang!
        </h1>

        <p className="text-gray-300 mb-8">
          Masuk ke akun anda untuk memulai belanja
        </p>

        <label className="text-sm mb-1">Nim/Nik</label>
        <input
          type="text"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="mb-4 p-3 rounded-lg bg-white text-black"
          placeholder="Masukkan Nim/Nik"
        />

        <label className="text-sm mb-1">Kata Sandi</label>
        <div className="flex bg-white rounded-lg mb-6 overflow-hidden">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 p-3 text-black outline-none"
            placeholder="Masukkan password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-4 text-gray-500 hover:text-black flex items-center"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="bg-white text-[#2D5A74] py-3 rounded-lg font-semibold hover:scale-95 transition"
        >
          Masuk
        </button>

        {message && (
          <p className="mt-4 text-sm">{message}</p>
        )}

        <p className="mt-16 text-xs text-gray-300 text-center">
          Coopify 2026
        </p>
      </div>

      {/* RIGHT */}
      <div
        className="w-1/2 h-full relative flex items-center justify-end"
        style={{
          backgroundImage: "url('/img/login.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        {/* overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        
        </div>
      </div>
  )
}

export default Login