export default function DeleteModal({
    showDeleteModal,
    setShowDeleteModal,
    confirmDelete,
}) {
    if (!showDeleteModal) return null;

    return (
        <>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white w-[350px] rounded-xl shadow-lg p-5">
                        <h2 className="text-lg font-semibold mb-2">
                            Konfirmasi Hapus
                        </h2>

                        <p className="text-sm text-gray-500 mb-4">
                            Yakin mau hapus produk{" "}
                            <span className="font-semibold text-black">
                                {selectedDelete?.nama_produk}
                            </span>
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
                            >
                                Hapus
                            </button>

                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg text-sm"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
