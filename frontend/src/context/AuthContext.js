import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logoutWorker } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore session from cookie
    getProfile()
      .then((data) => setWorker(data.worker))
      .catch(() => setWorker(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (workerData) => {
    setWorker(workerData);
  };

  const logout = async () => {
    await logoutWorker();
    setWorker(null);
  };

  return (
    <AuthContext.Provider value={{ worker, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
