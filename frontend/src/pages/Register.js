import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWorker } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

const SKILLS = [
  "Electrician", "Plumber", "Carpenter", "Painter",
  "Mason", "Welder", "AC Technician", "Driver",
  "Security Guard", "Delivery", "Housekeeping", "Other"
];

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", skill: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.skill) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const data = await registerWorker(form);
      login(data.worker);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
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
          Protect your gig.<br />Build your future.
        </div>
        <p className="auth-panel-sub">
          Join thousands of gig workers who trust GigKavach for insurance, benefits, and financial security.
        </p>
        <div className="auth-panel-badges">
          <span className="auth-badge">✦ Insurance Coverage</span>
          <span className="auth-badge">✦ Instant Claims</span>
          <span className="auth-badge">✦ 24/7 Support</span>
        </div>
      </div>

      {/* Right Form */}
      <div className="auth-form-side">
        <div className="auth-form-box">
          <h2>Create account</h2>
          <p className="auth-subtitle">Start your protection journey today</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Ravi Kumar"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
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
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Your Skill *</label>
              <select name="skill" value={form.skill} onChange={handleChange} required>
                <option value="">Select your skill</option>
                {SKILLS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
