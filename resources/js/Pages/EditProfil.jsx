import React, { useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { FaBell, FaShoppingCart, FaUserCircle, FaCamera, FaIdCard, FaPhone, FaEnvelope } from "react-icons/fa";

export default function EditProfil() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    nama: "Winda",
    nim: "434234235",
    phone: "08123456789",
    email: "winda@mail.com",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

const [showConfirm, setShowConfirm] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);

const handleSubmit = (e) => {
  e.preventDefault();
  setShowConfirm(true);
};

const handleConfirmSave = () => {
  setShowConfirm(false);
  console.log(form);
  setShowSuccess(true);
};

  return (
    <AppLayout role="pengguna">
      <div className="bg-gray-100 min-h-screen p-6">

        {/* Header */}
        <div className="bg-[#3F7EA2] text-white p-6  rounded-t-lg">
          <h2 className="text-lg font-semibold">Halo, Winda! 👋</h2>
          <p className="text-sm">
            Atur informasi akun Anda di sini.
          </p>
        </div>
        <div className="mx-auto bg-white p-6 rounded-b-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Edit Profil
          </h2>

          {/* Foto Profil */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20">

              <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  "WI"
                )}
              </div>

              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-white border rounded-full p-1.5 shadow"
              >
                <FaCamera size={12} />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImage}
                className="hidden"
              />

            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm">Nama</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm">NIM</label>
              <input
                type="text"
                name="nim"
                value={form.nim}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm">No HP</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>

            {/* Button */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate("/profil-pengguna")}
                className="px-3 py-2 bg-gray-300 rounded text-sm"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Simpan
              </button>
            </div>

          </form>
        </div>
        </div>
        {showConfirm && (
<div className="fixed inset-0 bg-black/10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow w-80 text-center">
      <h2 className="text-lg font-semibold mb-3">Konfirmasi</h2>
      <p className="text-sm mb-5">
        Apakah anda yakin ingin mengubah data ini?
      </p>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-2 bg-gray-300 rounded text-sm"
        >
          Batal
        </button>

        <button
          onClick={handleConfirmSave}
          className="px-3 py-2 bg-green-500 text-white rounded text-sm"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
)}
      {showSuccess && (
<div className="fixed inset-0 bg-black/10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow w-80 text-center">
      <h2 className="text-lg font-semibold mb-3 text-green-600">
        Berhasil
      </h2>
      <p className="text-sm mb-5">
        Data berhasil disimpan
      </p>

      <button
        onClick={() => {
          setShowSuccess(false);
          navigate("/profil-pengguna");
        }}
        className="px-3 py-2 bg-green-500 text-white rounded text-sm"
      >
        OK
      </button>
    </div>
  </div>
)}
    </AppLayout>
  );
}