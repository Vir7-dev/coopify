import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
    currentItems,
    totalItems,
    currentPage,
    totalPages,
    setCurrentPage,
    label = "item",
}) {
    return (
        <div className="flex justify-between items-center p-4 text-sm text-gray-500">
            <p>
                Menampilkan {currentItems} dari {totalItems} {label}
            </p>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md border font-medium transition-colors ${
                        currentPage === 1
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                            : "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                    }`}
                >
                    <FaChevronLeft size={10} />
                    Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-2 py-1 text-xs rounded-md border ${
                            currentPage === i + 1
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md border font-medium transition-colors ${
                        currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                            : "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                    }`}
                >
                    Next
                    <FaChevronRight size={10} />
                </button>
            </div>
        </div>
    );
}
