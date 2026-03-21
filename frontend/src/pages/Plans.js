import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createPaymentOrder, verifyPayment } from "../api/api";
import "../styles/global.css";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    desc: "Basic access to GigKavach platform.",
    features: [
      "Worker profile",
      "Community access",
      "Basic job alerts",
    ],
    amount: 0,
  },
  {
    id: "basic",
    name: "Basic",
    price: 499,
    desc: "Essential protection for active gig workers.",
    features: [
      "Everything in Free",
      "Accident insurance ₹1L",
      "Health OPD benefits",
      "Priority email support",
      "Monthly welfare credits",
    ],
    amount: 49900, // in paise
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 999,
    desc: "Maximum coverage for serious gig workers.",
    features: [
      "Everything in Basic",
      "Accident insurance ₹5L",
      "Hospitalization cover",
      "24/7 phone support",
      "Legal aid assistance",
      "Family health benefits",
    ],
    amount: 99900,
  },
];

const Plans = () => {
  const { worker, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null); // plan id being processed
  const [error, setError] = useState("");

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan) => {
    if (plan.id === "free") return;
    if (worker?.plan === plan.id) return;

    setError("");
    setLoading(plan.id);

    try {
      const ok = await loadRazorpay();
      if (!ok) {
        setError("Payment gateway failed to load. Please check your connection.");
        setLoading(null);
        return;
      }

      const { order, key } = await createPaymentOrder({
        amount: plan.amount,
        plan: plan.id,
      });

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "GigKavach",
        description: `${plan.name} Plan Subscription`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.id,
            });
            // Update worker plan in context
            login({ ...worker, plan: result.plan });
            navigate("/dashboard");
          } catch (err) {
            setError("Payment verification failed. Contact support if amount was deducted.");
          }
        },
        prefill: {
          name: worker?.name || "",
          email: worker?.email || "",
        },
        theme: { color: "#1a56db" },
        modal: {
          ondismiss: () => setLoading(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err?.response?.data?.message || "Payment initiation failed.");
      setLoading(null);
    }
  };

  return (
    <div className="plans-wrapper">
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-logo">Gig<span>Kavach</span></div>
        <div className="topbar-right">
          <Link to="/dashboard" className="btn-outline">← Dashboard</Link>
        </div>
      </header>

      {/* Content */}
      <main className="plans-content">
        <div className="plans-header">
          <h1>Choose Your Plan</h1>
          <p>Simple, transparent pricing. Cancel anytime.</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ maxWidth: 600, margin: "0 auto 32px" }}>
            {error}
          </div>
        )}

        <div className="plans-grid">
          {PLANS.map((plan) => {
            const isCurrent = worker?.plan === plan.id;
            const isLoading = loading === plan.id;

            return (
              <div
                key={plan.id}
                className={`plan-card ${plan.featured ? "featured" : ""}`}
              >
                {plan.featured && (
                  <div className="plan-card-tag">Most Popular</div>
                )}

                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  {plan.price === 0 ? (
                    "Free"
                  ) : (
                    <>
                      ₹{plan.price}<span>/mo</span>
                    </>
                  )}
                </div>
                <div className="plan-desc">{plan.desc}</div>

                <ul className="plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                {isCurrent ? (
                  <>
                    <button className="btn-plan" disabled>Current Plan</button>
                    <div className="current-plan-note">You are on this plan</div>
                  </>
                ) : plan.price === 0 ? (
                  <button className="btn-plan" disabled>Free Forever</button>
                ) : (
                  <button
                    className={`btn-plan ${plan.featured ? "featured" : ""}`}
                    onClick={() => handlePayment(plan)}
                    disabled={!!loading}
                  >
                    {isLoading ? "Processing..." : `Get ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Plans;
