import { useCallback, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { ToastContext } from "../toastContext.js";

// Lightweight toast notification system (no external library needed).
// Usage:
//   const toast = useToast();
//   toast.success("Project created");
//   toast.error("Something went wrong");

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type) => {
      const id = Date.now() + Math.random();

      setToasts((current) => [...current, { id, message, type }]);

      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  const toast = {
    success: (message) => addToast(message, "success"),
    error: (message) => addToast(message, "error"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast container */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg transition ${
              item.type === "success"
                ? "border-green-200 bg-white text-gray-900"
                : "border-red-200 bg-white text-gray-900"
            }`}
          >
            {item.type === "success" ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-600" />
            ) : (
              <XCircle size={20} className="mt-0.5 shrink-0 text-red-600" />
            )}

            <p className="flex-1 text-sm font-medium">{item.message}</p>

            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
