import React, { useState, useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  FaShoppingCart,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaBoxOpen
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function ProfilPengguna() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [statistik, setStatistik] = useState({
    total_pesanan: 0,
    total_belanja: 0,
    siap_diambil: 0
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profil-pengguna");
      setUser(res.data.user);
      setStatistik(res.data.statistik);
      setData(res.data.riwayat);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal memuat profil",
        text: "Silakan coba lagi nanti",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Ambil Pesanan") {
      return "bg-blue-100 text-blue-600";
    }
    if (status === "Selesai") {
      return "bg-green-100 text-green-600";
    }
    return "bg-gray-100 text-gray-500";
  };

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = data.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (loading) {
    return (
      <AppLayout role="pengguna">
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role="pengguna">
      <div className="bg-gray-100 min-h-screen px-2 sm:px-0 pb-10">

        {/* HEADER */}
        <div className="bg-[#3F7EA2] text-white p-6 mx-4 sm:mx-6 mt-6 rounded-t-lg">
          <h2 className="text-lg font-semibold">Halo, {user?.nama}! 👋</h2>
          <p className="text-sm">
            Kelola akun dan pantau riwayat belanja kamu di sini
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white mx-4 sm:mx-6 p-6 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex gap-4 items-center">
            <div className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-lg text-xl font-bold uppercase overflow-hidden">
              {user?.foto_profil ? (
                <img src={user.foto_profil} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                user?.nama ? user.nama.substring(0, 2) : "US"
              )}
            </div>

            <div>
              <h3 className="font-bold text-lg capitalize">{user?.nama}</h3>

              <div className="mt-2 space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full">
                    <FaIdCard /> {user?.nim_nik}
                  </span>

                  <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full">
                    <FaPhone /> {user?.no_hp || "-"}
                  </span>
                </div>

                <span className="flex items-center gap-1 bg-gray-200 text-xs px-3 py-1 rounded-full w-fit">
                  <FaEnvelope /> {user?.email || "-"}
                </span>
              </div>
            </div>
          </div>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-600 active:scale-95 transition"
            onClick={() => navigate("/edit-profil")}
          >
            Edit Profil
          </button>
        </div>

        {/* STATISTIK */}
        <div className="mx-4 sm:mx-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-6">

          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl text-lg">
              <FaShoppingCart />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Pesanan</p>
              <h2 className="text-xl font-bold">{statistik.total_pesanan}</h2>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-xl text-lg">
              <FaCreditCard />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Belanja</p>
              <h2 className="text-xl font-bold">
                Rp {statistik.total_belanja.toLocaleString("id-ID")}
              </h2>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-xl text-lg">
              <FaBoxOpen />
            </div>
            <div>
              <p className="text-xs text-gray-500">Siap Diambil</p>
              <h2 className="text-xl font-bold">{statistik.siap_diambil}</h2>
            </div>
          </div>
        </div>

        {/* RIWAYAT */}
        <div className="mx-4 sm:mx-6 mt-6 bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Riwayat Pesanan</h2>
          </div>

          {data.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Belum ada riwayat pesanan.
            </div>
          ) : (
            <>
              <div className="space-y-4 p-4">
                {currentItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4 shadow-sm">

                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-sm">{item.kategori}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-16 h-40 sm:h-16 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={item.gambar}
                          alt={item.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.nama}</h4>
                        <p className="text-xs text-gray-500">
                          {item.tgl ? new Date(item.tgl).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }) : "-"}
                        </p>

                        <p className="text-sm font-semibold mt-1">
                          Rp {item.harga.toLocaleString("id-ID")}
                        </p>

                        <p className="text-xs text-gray-500">
                          Jumlah: {item.jumlah}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">Kode Pesanan: <span className="font-semibold text-gray-700">{item.kode_pesanan}</span></p>
                      <p className="text-sm font-bold">
                        Total: Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-end items-center gap-3 p-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2 flex-wrap">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === i + 1
                            ? "bg-blue-500 text-white"
                            : "border"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </AppLayout>
  );
}