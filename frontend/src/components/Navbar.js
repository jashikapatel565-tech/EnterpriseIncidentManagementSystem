/**
 * Navbar Component
 * ----------------
 * Top navigation bar with user info, role badge, and logout.
 */

import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-pink-200/50 flex items-center justify-between px-6 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-pink-400 flex items-center justify-center shadow-glow">
          <span className="text-white text-sm">✨</span>
        </div>
        <h1
          className="text-lg font-bold text-gradient cursor-pointer"
          onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
        >
          Incident Manager
        </h1>
      </div>

      {/* User info */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-pink-900">{user.name}</span>
              <span className="text-xs text-pink-500">{user.email}</span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isAdmin
                  ? "bg-pink-500 text-white shadow-sm"
                  : "bg-pink-100 text-pink-500 border border-pink-200"
              }`}
            >
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs font-medium px-3 py-1.5 rounded-full text-pink-500 hover:text-white border border-pink-400 hover:bg-pink-500 transition-all shadow-sm ml-2"
              id="logout-btn"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
