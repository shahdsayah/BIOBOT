/** @file Toast notification system. Provides addToast(message, type) for success/error/warning pop-ups that auto-dismiss after 3.5s. */

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

/** Provides addToast() to the component tree and renders the toast overlay. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random(); // random suffix avoids collision on rapid calls
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => onRemove(toast.id)}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium cursor-pointer animate-fade-in-up transition-all ${
            toast.type === "error"
              ? "bg-red-600"
              : toast.type === "warning"
              ? "bg-amber-500"
              : "bg-green-600"
          }`}
        >
          <span>
            {toast.type === "error" ? "✕" : toast.type === "warning" ? "⚠" : "✓"}
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

/** Returns { addToast }. Must be called inside ToastProvider. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
