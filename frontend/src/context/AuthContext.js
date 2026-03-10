/**
 * Auth Context
 * ------------
 * Provides user, token, login/logout, and role helpers to the entire app.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists try to load the user profile.
  const loadUser = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await getMe();
      setUser(res.data);
    } catch {
      // Token expired or invalid — clear it.
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadUser(); }, [loadUser]);

  const loginUser = (tokenStr, userData) => {
    localStorage.setItem("token", tokenStr);
    setToken(tokenStr);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, login: loginUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
