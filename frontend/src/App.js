import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";

const ProtectedRoute = ({ children }) => {
  const { worker, loading } = useAuth();
  if (loading) return <div className="gk-loading"><span>Loading...</span></div>;
  return worker ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { worker, loading } = useAuth();
  if (loading) return <div className="gk-loading"><span>Loading...</span></div>;
  return !worker ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
