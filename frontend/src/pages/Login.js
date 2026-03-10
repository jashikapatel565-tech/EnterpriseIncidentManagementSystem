/**
 * Login Page
 * ----------
 * Email + password form → POST /auth/login → stores JWT → redirects.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as apiLogin } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      login(res.data.access_token, res.data.user);
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-pink-300/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-pink-500 to-pink-400 rounded-full flex items-center justify-center shadow-glow mb-4">
            <span className="text-white text-3xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Incident Manager
          </h1>
          <p className="text-pink-900/60 text-sm font-medium">Log into your account</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in shadow-soft"
          id="login-form"
        >
          {error && (
            <div className="bg-red-50 text-red-500 text-sm font-semibold rounded-xl px-4 py-3 border border-red-100 flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Email Address</label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-pink-200 text-pink-900 placeholder-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 outline-none transition-all text-sm font-medium shadow-sm"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Password</label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-pink-200 text-pink-900 placeholder-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 outline-none transition-all text-sm font-medium shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-400 hover:to-pink-300 text-white font-bold text-sm transition-all hover:-translate-y-1 shadow-glow hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
            id="login-submit-btn"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>

          <p className="text-center text-sm font-semibold text-pink-900/60 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-pink-500 hover:text-pink-400 transition-colors">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
