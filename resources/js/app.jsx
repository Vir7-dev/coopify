import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import '../css/app.css'

function App() {
  const [nim, setNim] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

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
      setMessage("❌ Terjadi error, cek console")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h1 className="text-xl font-bold mb-4 text-center">Login Coopify 🔐</h1>

        <input
          type="text"
          placeholder="NIM / NIK"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 border border-gray-600"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded"
        >
          Login
        </button>

        {message && (
          <p className="mt-4 text-sm text-center">{message}</p>
        )}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />)