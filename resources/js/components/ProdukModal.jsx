import { FaBox, FaTimes, FaPlus } from "react-icons/fa";
export default function ProdukModal({
    showModal,
    setShowModal,
    isEdit,
    form,
    handleChange,
    handleSubmit,
    kategori,
    fileInputRef,
    handleFileChange,
    handleUploadClick,
    fileName,
}) {
    if (!showModal) return null;

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-[400px] rounded-[10px] shadow-2xl overflow-hidden">
                        <div className="bg-[#0099D5] text-white px-5 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FaBox className="text-white text-lg" />
                                <h2 className="text-lg font-bold tracking-tight">
                                    {isEdit ? "Edit Produk" : "Tambah Produk"}
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="hover:scale-110 transition-transform"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>

                        <div className="p-5 space-y-3.5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                        Nama Produk
                                    </label>
                                    <input
                                        type="text"
                                        name="nama_produk"
                                        placeholder="Nama produk"
                                        value={form.nama_produk}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                        Harga Produk
                                    </label>
                                    <input
                                        type="number"
                                        name="harga_jual"
                                        placeholder="Harga"
                                        value={form.harga_jual}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                    Upload Gambar
                                </label>

                                <input
                                    type="file"
                                    multiple
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />

                                <div
                                    onClick={handleUploadClick}
                                    className="border-2 border-dashed border-gray-200 rounded-xl py-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <div className="bg-[#1D63D3] p-1.5 rounded text-white mb-1">
                                        <FaPlus size={10} />
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {fileName ? fileName : "Choose File"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                        Jumlah Stok
                                    </label>
                                    <input
                                        type="number"
                                        name="stok"
                                        placeholder="Stok"
                                        value={form.stok}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                        Tgl Kadaluarsa
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="tgl_kadaluarsa"
                                            value={form.tgl_kadaluarsa}
                                            onChange={handleChange}
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                    Deskripsi Produk
                                </label>
                                <textarea
                                    type="text"
                                    name="deskripsi"
                                    placeholder="Deskripsi"
                                    value={form.deskripsi}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-500 ml-1">
                                    Kategori
                                </label>

                                <select
                                    name="id_kat_fk_p"
                                    value={form.id_kat_fk_p}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-[#0099D5] outline-none"
                                >
                                    <option value="">Pilih Kategori</option>
                                    <option value="1">Makanan</option>
                                    <option value="2">Minuman</option>
                                    <option value="3">
                                        Obat dan kesehatan
                                    </option>
                                    <option value="4">Alat Tulis</option>
                                    <option value="5">Almamater</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-[#1D63D3] hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
                                >
                                    Simpan
                                </button>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-[#0099D5] hover:bg-[#0088C0] text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
