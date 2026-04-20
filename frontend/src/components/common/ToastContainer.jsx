import React, { useContext } from "react";
import ToastContext from "../../contexts/common/ToastContext";
import { Alert } from "@mui/material";
import { IoClose } from "react-icons/io5";

// ✅ NEW: Toast notification display component with animations
const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-in-right"
          style={{
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          <Alert
            severity={toast.type}
            onClose={() => removeToast(toast.id)}
            sx={{
              mb: 1,
              borderRadius: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              "& .MuiAlert-action": {
                p: 0,
              },
            }}
            action={
              <button
                onClick={() => removeToast(toast.id)}
                className="text-current hover:opacity-70 p-0"
                aria-label="Close notification"
              >
                <IoClose size={20} />
              </button>
            }
          >
            {toast.message}
          </Alert>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
