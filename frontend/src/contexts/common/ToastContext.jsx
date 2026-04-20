import React, { createContext, useState, useCallback } from "react";

// ✅ NEW: Toast notification context for user feedback
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const showSuccess = useCallback(
    (message, duration = 3000) => showToast(message, "success", duration),
    [showToast]
  );

  const showError = useCallback(
    (message, duration = 5000) => showToast(message, "error", duration),
    [showToast]
  );

  const showWarning = useCallback(
    (message, duration = 4000) => showToast(message, "warning", duration),
    [showToast]
  );

  const showInfo = useCallback(
    (message, duration = 3000) => showToast(message, "info", duration),
    [showToast]
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
