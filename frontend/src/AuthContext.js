// src/context/AuthContext.js
// Provides worker auth state to the entire React app.
// Drop <AuthProvider> around your app in index.js or App.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logoutWorker } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [worker, setWorker] = useState(null);       // worker object or null
  const [loading, setLoading] = useState(true);     // true while fetching profile on mount

  // On mount — try to restore session from cookie
  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setWorker(data.worker);
      } catch {
        setWorker(null); // not logged in
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (workerData) => {
    setWorker(workerData);
  };

  const logout = async () => {
    try {
      await logoutWorker();
    } finally {
      setWorker(null);
    }
  };

  return (
    <AuthContext.Provider value={{ worker, loading, login, logout, setWorker }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this in any component
export const useAuth = () => useContext(AuthContext);
