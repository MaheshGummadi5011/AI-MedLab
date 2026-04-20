import React, { useState, useContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";
import CheckoutForm from "./CheckoutForm";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

const stripePromise = loadStripe(`${import.meta.env.VITE_PUBLICATION_KEY}`);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Checkout Error</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <div className="space-y-3">
        <button 
          onClick={onRetry}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.history.back()}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Return to Cart
        </button>
      </div>
    </div>
  </div>
);

const LoadingDisplay = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4">
        <div className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600">Initializing checkout...</p>
    </div>
  </div>
);

export default function Checkout() {
  const navigate = useNavigate();
  const { isLoading, toggleLoading } = useContext(commonContext);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCheckout = async () => {
      // Don't initialize if we already have a clientSecret
      if (clientSecret) return;
      
      // Don't initialize if there's no amount
      const amount = localStorage.getItem("totalPrice");
      if (!amount) {
        setError("Invalid checkout amount - Please add items to cart first");
        setTimeout(() => navigate("/cart"), 2000);
        return;
      }

      toggleLoading(true);
      setError(null);

      try {
        const response = await httpClient.post("/create-payment-intent", {
          amount: parseFloat(amount),
        });

        if (!response.data?.clientSecret) {
          throw new Error("Invalid response from payment server");
        }

        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Checkout initialization failed:", err);
        setError(err.response?.data?.error || err.message || "Unable to initialize payment");
      } finally {
        toggleLoading(false);
      }
    };

    initializeCheckout();
  }, []); // Empty dependency array since we check clientSecret inside

  useScrollDisable(isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  const options = {
    clientSecret: clientSecret,
    appearance: { theme: 'stripe' },
    loader: 'auto',
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {clientSecret ? (
          <Elements 
            stripe={stripePromise}
            options={options}
          >
            <CheckoutForm />
          </Elements>
        ) : (
          <LoadingDisplay />
        )}
      </div>
    </div>
  );
}