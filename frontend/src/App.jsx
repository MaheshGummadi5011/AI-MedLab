import React, { useEffect, useContext } from "react";
import { CommonProvider } from "./contexts/common/commonContext";
import { CartProvider } from "./contexts/cart/cartContext";
import { FiltersProvider } from "./contexts/filters/filterContext";
import Header from "./components/common/Header";
import RouterRoutes from "./routes/RouterRoutes";
import Footer from "./components/common/Footer";
import httpClient from "./httpClient";
import ChatBot from "./components/common/ChatBot";
// import CursorTrail from "./components/common/Cursortrail";
import { DarkModeProvider } from "./contexts/DarkMode/DarkModeContext";
// ✅ FIXED: Added Error Boundary to catch React errors
import ErrorBoundary from "./components/common/ErrorBoundary";
// ✅ IMPROVED: Added Toast provider for user notifications
import { ToastProvider } from "./contexts/common/ToastContext";
import ToastContainer from "./components/common/ToastContainer";
import useToast from "./hooks/useToast";

// ✅ IMPROVED: Separate component for doctor status syncing with toast notifications
const DoctorStatusSyncer = () => {
  const { showError } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem("usertype") === "doctor") {
        httpClient
          .post("make_meet", { email: localStorage.getItem("email") })
          .then((res) => {
            if (res.data.link !== null) {
              localStorage.setItem("curpname", res.data.link["name"]);
              localStorage.setItem("curmlink", res.data.link["link"]);
              localStorage.setItem("setSearchPatient", true);
              localStorage.setItem("searching", 2);
            } else {
              localStorage.setItem("setSearchPatient", false);
              localStorage.setItem("curpname", "");
              localStorage.setItem("curmlink", "");
              localStorage.setItem("searching", 1);
            }
          })
          .catch((err) => {
            // ✅ IMPROVED: Show error to user instead of silent console.log
            console.log(err);
            if (err.response?.status !== 503) {
              showError("Failed to sync doctor status. Check your connection.");
            }
          });
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [showError]);

  return null;
};

const App = () => {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <DarkModeProvider>
          <CommonProvider>
            <FiltersProvider>
              <CartProvider>
                <DoctorStatusSyncer />
                <Header />
                <RouterRoutes />
                <Footer />
                <ChatBot />
                <ToastContainer />
              </CartProvider>
            </FiltersProvider>
          </CommonProvider>
        </DarkModeProvider>
      </ErrorBoundary>
    </ToastProvider>
  );
};

export default App;