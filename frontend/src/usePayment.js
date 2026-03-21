// src/hooks/usePayment.js
// Custom hook to trigger Razorpay checkout and verify payment.
// Usage:
//   const { startPayment, loading, error } = usePayment();
//   await startPayment({ amount: 49900, plan: "basic", workerName, workerEmail });

import { useState } from "react";
import { createOrder, verifyPayment } from "./services/api";
import { useAuth } from "../context/AuthContext";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.querySelector('script[src*="razorpay"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const usePayment = () => {
  const { worker, setWorker } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * @param {{ amount: number, plan: string }} options
   *   amount — in paise (₹499 = 49900)
   *   plan   — "basic" | "premium"
   */
  const startPayment = async ({ amount, plan }) => {
    setError(null);
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay SDK failed to load");

      const { order, key } = await createOrder({ amount, plan });

      return new Promise((resolve, reject) => {
        const options = {
          key,
          amount: order.amount,
          currency: order.currency,
          name: "GigKavach",
          description: `${plan} Plan`,
          order_id: order.id,
          prefill: {
            name: worker?.name || "",
            email: worker?.email || "",
          },
          handler: async (response) => {
            try {
              const result = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
              });
              // Update worker plan in context
              setWorker((prev) => ({ ...prev, plan: result.plan }));
              resolve(result);
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
          theme: { color: "#1976d2" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { startPayment, loading, error };
};

export default usePayment;
