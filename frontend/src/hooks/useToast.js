import { useContext } from "react";
import ToastContext from "../contexts/common/ToastContext";

// ✅ NEW: Custom hook to use toast notifications throughout the app
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export default useToast;
