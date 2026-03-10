/**
 * Signup Page
 * -----------
 * Registration form → POST /auth/signup → auto-login → redirect.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup as apiSignup } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiSignup({ name, email, password, role });
      login(res.data.access_token, res.data.user);
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-pink-500 to-pink-400 rounded-full flex items-center justify-center shadow-glow mb-4">
            <span className="text-white text-3xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Create Account
          </h1>
          <p className="text-pink-900/60 text-sm font-medium">Join the incident management platform</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-3xl p-8 space-y-5 animate-fade-in shadow-soft"
          id="signup-form"
        >
          {error && (
            <div className="bg-red-50 text-red-500 text-sm font-semibold rounded-xl px-4 py-3 border border-red-100 flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Full Name</label>
            <input
              id="signup-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-pink-200 text-pink-900 placeholder-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 outline-none transition-all text-sm font-medium shadow-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Email</label>
            <input
              id="signup-email"
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
              id="signup-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-pink-200 text-pink-900 placeholder-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 outline-none transition-all text-sm font-medium shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Role</label>
            <select
              id="signup-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-pink-200 text-pink-900 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 outline-none transition-all text-sm font-medium shadow-sm"
            >
              <option value="user" className="bg-white">User</option>
              <option value="admin" className="bg-white">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-400 hover:to-pink-300 text-white font-bold text-sm transition-all hover:-translate-y-1 shadow-glow hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
            id="signup-submit-btn"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm font-semibold text-pink-900/60 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-500 hover:text-pink-400 transition-colors">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
