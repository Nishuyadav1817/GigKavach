import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

const Dashboard = () => {
  const { worker, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const planLabel = worker?.plan
    ? worker.plan.charAt(0).toUpperCase() + worker.plan.slice(1)
    : "Free";

  const planClass = `plan-badge plan-${worker?.plan || "free"}`;

  return (
    <div className="dashboard-wrapper">
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-logo">Gig<span>Kavach</span></div>
        <div className="topbar-right">
          <span className="topbar-name">Hello, {worker?.name?.split(" ")[0]} 👋</span>
          <Link to="/plans" className="btn-accent">Upgrade Plan</Link>
          <button className="btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Content */}
      <main className="dashboard-content">
        {/* Hero */}
        <div className="dashboard-hero">
          <h1>Your Dashboard</h1>
          <p>Manage your profile, coverage, and plan from one place.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-label">Current Plan</div>
            <div className="stat-card-value">
              <span className={planClass}>{planLabel}</span>
            </div>
            <div className="stat-card-sub">
              {worker?.plan === "free"
                ? "Upgrade for more benefits"
                : "Active protection"}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">Your Skill</div>
            <div className="stat-card-value" style={{ fontSize: "1.4rem" }}>
              {worker?.skill || "Not set"}
            </div>
            <div className="stat-card-sub">Registered profession</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">Account Status</div>
            <div className="stat-card-value" style={{ fontSize: "1.4rem", color: "var(--success)" }}>
              Active
            </div>
            <div className="stat-card-sub">Your account is in good standing</div>
          </div>
        </div>

        {/* Upgrade Banner — only for free plan */}
        {(!worker?.plan || worker?.plan === "free") && (
          <div className="upgrade-banner">
            <div className="upgrade-banner-text">
              <h3>Get full protection with Basic or Premium</h3>
              <p>Unlock accident coverage, health benefits, and priority support.</p>
            </div>
            <Link to="/plans" className="btn-gold">View Plans →</Link>
          </div>
        )}

        {/* Profile Details */}
        <div className="section-card">
          <h3>Profile Information</h3>
          <div className="profile-row">
            <span className="profile-row-label">Full Name</span>
            <span className="profile-row-value">{worker?.name || "—"}</span>
          </div>
          <div className="profile-row">
            <span className="profile-row-label">Email</span>
            <span className="profile-row-value">{worker?.email || "—"}</span>
          </div>
          <div className="profile-row">
            <span className="profile-row-label">Phone</span>
            <span className="profile-row-value">{worker?.phone || "Not provided"}</span>
          </div>
          <div className="profile-row">
            <span className="profile-row-label">Skill</span>
            <span className="profile-row-value">{worker?.skill || "Not set"}</span>
          </div>
          <div className="profile-row">
            <span className="profile-row-label">Plan</span>
            <span className="profile-row-value">
              <span className={planClass}>{planLabel}</span>
            </span>
          </div>
          <div className="profile-row">
            <span className="profile-row-label">Verification</span>
            <span className="profile-row-value">
              {worker?.isVerified ? "✅ Verified" : "⏳ Pending Verification"}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-card">
          <h3>Quick Actions</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/plans" className="btn-accent">View & Upgrade Plans</Link>
            <button className="btn-outline" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
