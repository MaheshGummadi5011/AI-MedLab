import React, { useEffect, useState, useContext } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import cartContext from "../contexts/cart/cartContext";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { orders } = useContext(cartContext);

  //   const [email, setEmail] = useState(localStorage.getItem("email"));
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isElementsReady, setIsElementsReady] = useState(false);

  useEffect(() => {
    if (!stripe || !elements) return;

    // Wait for elements to be fully mounted
    const checkElements = async () => {
      const element = elements.getElement(PaymentElement);
      if (element) {
        setIsElementsReady(true);
      }
    };

    checkElements();
  }, [stripe, elements]);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !isElementsReady) {
      console.log("Payment form not ready:", { stripe: !!stripe, elements: !!elements, isElementsReady });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Store orders before payment attempt
      localStorage.setItem("orders", JSON.stringify(orders));

      // Get the payment element instance
      const paymentElement = elements.getElement(PaymentElement);
      if (!paymentElement) {
        throw new Error("Payment element not found");
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setMessage(err.message || "Failed to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isElementsReady) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[500px] shadow-lg rounded-lg p-8 mt-10 mx-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading payment form...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] shadow-lg rounded-lg p-8 mt-10 mx-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Payment Details</h2>
          <p className="text-gray-600">
            Amount: ₹{localStorage.getItem("totalPrice")}.00
          </p>
        </div>

        <PaymentElement 
          id="payment-element" 
          className="mb-6"
          options={{
            layout: "tabs"
          }}
        />
        
        <button
          type="submit"
          disabled={isLoading || !stripe || !elements || !isElementsReady}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            "Pay now"
          )}
        </button>

        {message && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}