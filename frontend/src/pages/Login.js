import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWorker } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginWorker(form);
      login(data.worker);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Panel */}
      <div className="auth-panel">
        <div className="auth-panel-logo">Gig<span>Kavach</span></div>
        <div className="auth-panel-headline">
          Welcome back,<br />gig worker.
        </div>
        <p className="auth-panel-sub">
          Log back in to manage your coverage, track claims, and stay protected on every job.
        </p>
        <div className="auth-panel-badges">
          <span className="auth-badge">✦ Secure Login</span>
          <span className="auth-badge">✦ Instant Access</span>
          <span className="auth-badge">✦ Your Data Safe</span>
        </div>
      </div>

      {/* Right Form */}
      <div className="auth-form-side">
        <div className="auth-form-box">
          <h2>Sign in</h2>
          <p className="auth-subtitle">Enter your credentials to continue</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="ravi@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
