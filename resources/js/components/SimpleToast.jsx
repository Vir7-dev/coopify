import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaInfo, FaExclamationTriangle } from "react-icons/fa";

// Simple toast without context provider
export function useSimpleToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "success", duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    };

    const toast = {
        success: (msg) => addToast(msg, "success"),
        error: (msg) => addToast(msg, "error"),
        info: (msg) => addToast(msg, "info"),
        warning: (msg) => addToast(msg, "warning"),
    };

    return { toast, toasts, setToasts };
}

export function SimpleToastContainer({ toasts, onRemove }) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
            {toasts.map((t) => (
                <SimpleToast key={t.id} toast={t} onRemove={onRemove} />
            ))}
        </div>
    );
}

function SimpleToast({ toast, onRemove }) {
    const icons = {
        success: <FaCheck className="text-white" size={16} />,
        error: <FaTimes className="text-white" size={16} />,
        info: <FaInfo className="text-white" size={16} />,
        warning: <FaExclamationTriangle className="text-white" size={16} />,
    };

    const bgColors = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        warning: "bg-amber-500",
    };

    return (
        <div
            className={`${bgColors[toast.type]} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-[400px]`}
            style={{ animation: "slideIn 0.3s ease-out" }}
        >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                {icons[toast.type]}
            </div>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-white/70 hover:text-white flex-shrink-0"
            >
                <FaTimes size={14} />
            </button>
        </div>
    );
}
