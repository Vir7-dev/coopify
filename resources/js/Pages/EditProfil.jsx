import React, { useState, useEffect, useRef } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import api from "../api";
import axios from "axios";
import { FaCamera, FaIdCard, FaPhone, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";

export default function EditProfil() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Ambil role dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role ?? "pengguna";
  const isAdmin = role === "admin";

  const [form, setForm] = useState({
    nama: "",
    nim: "",
    phone: "",
    email: "",
  });

  const [preview, setPreview] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      let userData;

      if (isAdmin) {
        // Admin: pakai axios langsung dengan Bearer token
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/profil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        userData = res.data.profil;
        setForm({
          nama: userData.nama || "",
          nim: userData.nim_nik || "",
          phone: userData.no_hp || "",
          email: userData.email || "",
        });
      } else {
        // Pengguna: pakai api instance
        const res = await api.get("/profil-pengguna");
        userData = res.data.user;
        setForm({
          nama: userData.nama || "",
          nim: userData.nim_nik || "",
          phone: userData.no_hp || "",
          email: userData.email || "",
        });
      }

      if (userData.foto_profil) {
        setPreview(userData.foto_profil);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal mengambil data profil", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("nama", form.nama);
      formData.append("no_hp", form.phone);
      if (!isAdmin) {
        formData.append("email", form.email);
      }
      if (fileToUpload) {
        formData.append("foto", fileToUpload);
      }

      if (isAdmin) {
        const token = localStorage.getItem("token");
        const res = await axios.post("/api/admin/profil", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Update localStorage supaya Navbar & halaman lain (mis. card profil) ikut update
        const updatedUser = { ...user, ...res.data.profil };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        const res = await api.post("/profil-pengguna", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Update localStorage supaya Navbar ikut update
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data profil berhasil disimpan!",
      }).then(() => {
        navigate(isAdmin ? "/profil-admin" : "/profil-pengguna");
      });
    } catch (error) {
      console.error(error);
      const errors = error.response?.data?.errors;
      let errorMessage = "Terjadi kesalahan saat menyimpan data";
      if (errors) {
        errorMessage = Object.values(errors).flat().join("\n");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire("Gagal", errorMessage, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout role={role}>
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role={role} showFooter={isAdmin ? false : undefined}>
      <div className="bg-gray-100 min-h-screen p-6">

        {/* Header */}
        <div className="bg-[#3F7EA2] text-white p-6 rounded-t-lg">
          <h2 className="text-lg font-semibold">Halo, {form.nama || (isAdmin ? "Admin" : "Pengguna")}! 👋</h2>
          <p className="text-sm">Atur informasi akun Anda di sini.</p>
        </div>

        <div className="mx-auto bg-white p-6 rounded-b-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Edit Profil</h2>

          {/* Foto Profil */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <div className="w-24 h-24 rounded-full bg-blue-500 overflow-hidden flex items-center justify-center text-white text-3xl font-bold uppercase">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Foto Profil" />
                ) : (
                  form.nama ? form.nama.substring(0, 2) : (isAdmin ? "AD" : "US")
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-white border rounded-full p-2 shadow text-gray-700 hover:text-blue-500 transition"
              >
                <FaCamera size={14} />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImage}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">

            <div>
              <label className="text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">NIM / NIK</label>
              <input
                type="text"
                name="nim"
                value={form.nim}
                disabled
                className="w-full border border-gray-300 bg-gray-100 text-gray-500 rounded px-3 py-2 mt-1 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">NIM / NIK tidak dapat diubah karena merupakan identitas tetap.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">No HP</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Email hanya untuk pengguna */}
            {!isAdmin && (
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Tombol */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(isAdmin ? "/profil-admin" : "/profil-pengguna")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-600 active:scale-95 transition disabled:opacity-50"
              >
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Konfirmasi</h2>
            <p className="text-sm mb-6 text-gray-600">
              Apakah Anda yakin ingin menyimpan perubahan data profil ini?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-600 active:scale-95 transition"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}