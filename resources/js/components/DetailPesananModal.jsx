import React from "react";
import { CheckCircle } from "lucide-react";

export default function DetailPesananModal({
    selectedOrder,
    setSelectedOrder,
    formatTanggal,
    getStatusClass,
    getStatusLabel,
    handleUpdateStatus,
    getNextActionLabel,
    isSubmitting = false,
}) {
    if (!selectedOrder) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setSelectedOrder(null)}
        >
            <div
                className="bg-white rounded-2xl w-[400px] max-h-[85vh] flex flex-col shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-bold">
                                Detail Pesanan
                            </h2>
                            <p className="text-blue-100 text-sm">
                                {selectedOrder.kode_pesanan}
                            </p>
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="text-white/80 hover:text-white text-2xl leading-none"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <p className="text-gray-500">Nama</p>
                            <p className="font-medium">
                                {selectedOrder.pengguna?.nama || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Tanggal</p>
                            <p className="font-medium">
                                {formatTanggal(selectedOrder.tgl_pesanan)}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm mb-2">
                            ITEM ({selectedOrder.detail_pesanan?.length || 0})
                        </p>

                        <div className="bg-gray-50 rounded-xl divide-y divide-gray-200 max-h-[200px] overflow-y-auto">
                            {selectedOrder.detail_pesanan?.map((dp, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 flex justify-between items-center"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            {dp.produk?.nama_produk || "-"}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Qty: {dp.jml_peritem || 0}
                                        </p>
                                    </div>

                                    <p className="font-semibold text-blue-600 text-sm">
                                        Rp{" "}
                                        {parseFloat(
                                            dp.subtotal_dp || 0
                                        ).toLocaleString("id-ID")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-3 flex justify-between items-center">
                        <span className="font-semibold text-gray-700">
                            Total
                        </span>

                        <span className="text-lg font-bold text-blue-600">
                            Rp{" "}
                            {parseFloat(
                                selectedOrder.total_harga || 0
                            ).toLocaleString("id-ID")}
                        </span>
                    </div>

                    <div className="flex justify-center">
                        <span
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(
                                selectedOrder.status_pesanan
                            )}`}
                        >
                            {getStatusLabel(selectedOrder.status_pesanan)}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-3 flex gap-2 flex-shrink-0">
                    {selectedOrder.status_pesanan !== "selesai" &&
                        selectedOrder.status_pesanan !== "dibatalkan" &&
                        selectedOrder.status_pesanan !== "belum bayar" &&
                        selectedOrder.status_pesanan !== "kadaluarsa" && (
                            <button
                                onClick={() => handleUpdateStatus(selectedOrder.id_pesanan, selectedOrder.status_pesanan)}
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 transition text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <CheckCircle size={16} />
                                {isSubmitting ? "Memproses..." : getNextActionLabel(selectedOrder.status_pesanan)}
                            </button>
                        )}

                    <button
                        onClick={() => setSelectedOrder(null)}
                        disabled={isSubmitting}
                        className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 rounded-xl transition text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}