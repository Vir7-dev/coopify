import React, { useState } from 'react'

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
      console.log("RAW RESPONSE:", text)

      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error("Response bukan JSON (kemungkinan error Laravel)")
      }

      if (res.ok) {
        setMessage("✅ Login berhasil")
        console.log("USER:", data.user)
      } else {
        setMessage("❌ " + data.message)
      }

    } catch (err) {
      console.error("ERROR:", err)
      setMessage("❌ Masukan Nama Pengguna dan Kata sandi")
    }
  }

  return (
  <div className="min-h-screen flex font-sans bg-gradient-to-br from-green-400 to-teal-500">

    {/* LEFT SIDE LOGIN */}
    <div className="w-1/2 bg-[#2D5A74] flex flex-col justify-center px-20 text-white rounded-r-3xl">

      <div className="flex items-center gap-3 mb-2">
        <img
          src="/img/logo.png"
          alt="Coopify Logo"
          className="w-16 h-16"
        />
        <h2 className="text-3xl font-bold">Coopify</h2>
      </div>

      <h1 className="text-4xl font-bold mt-10 mb-2">
        Selamat datang!
      </h1>

      <p className="text-gray-300 mb-10">
        Masuk ke akun anda untuk memulai belanja di koperasi
      </p>

      {/* USERNAME */}
      <label className="mb-2 font-semibold">Nim/Nik</label>
      <input
        type="text"
        placeholder="Masukkan Nim/Nik anda"
        value={nim}
        onChange={(e) => setNim(e.target.value)}
        className="mb-6 p-3 rounded bg-gray-200 text-black"
      />

      {/* PASSWORD */}
      <label className="mb-2 font-semibold">Kata Sandi</label>
      <div className="flex bg-gray-200 rounded mb-10">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan kata sandi anda"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex-1 p-3 rounded-l text-black outline-none"
        />

        <button
          onClick={() => setShowPassword(!showPassword)}
          className="px-4 text-black"
        >
          👁
        </button>
      </div>

      <button
        onClick={handleLogin}
        className="border border-white py-3 rounded hover:bg-white hover:text-black transition"
      >
        Masuk
      </button>

      {message && (
        <p className="mt-4 text-sm">{message}</p>
      )}

      <p className="mt-20 text-sm text-gray-300 text-center">
        Coopify 2026
      </p>

    </div>

    {/* RIGHT SIDE INFO */}
    <div className="w-1/2 flex flex-col items-center justify-center text-white text-center px-16">

      <div className="w-32 h-32 bg-white/20 flex items-center justify-center rounded-xl mb-8 text-7xl">
        🛒
      </div>

      <h2 className="text-3xl font-semibold mb-4">
        Koperasi digital untuk semua
      </h2>

      <p className="text-white/90 max-w-md mb-10">
        Semua kebutuhan koperasi kampus dalam satu tempat belanja produk dan kelola simpanan dengan mudah
      </p>

      <div className="bg-white/20 px-6 py-4 rounded-xl">
        <h3 className="text-2xl font-bold">150+</h3>
        <p className="text-sm">Produk tersedia</p>
      </div>

    </div>

  </div>
)
}

export default Login