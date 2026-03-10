/**
 * Sidebar Component
 * -----------------
 * Vertical side navigation. Shows admin links only for admin users.
 */

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard",  icon: "📊", path: "/dashboard" },
  { label: "My Tickets",  icon: "🎫", path: "/dashboard", hash: "#tickets" },
];

const ADMIN_ITEMS = [
  { label: "Admin Panel", icon: "⚙️", path: "/admin" },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const items = isAdmin ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass-card border-r border-pink-200/50 p-4 flex flex-col gap-2 z-40 mt-1">
      <div className="text-[10px] font-bold uppercase tracking-widest text-pink-400 mb-3 px-3">
        Navigation
      </div>
      {items.map((item) => {
        const active = location.pathname === item.path || (item.hash && location.hash === item.hash);
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path + (item.hash || ""))}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              active
                ? "bg-pink-500 text-white shadow-soft translate-x-1"
                : "text-pink-900 hover:text-pink-500 hover:bg-pink-100/50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        );
      })}

      {/* Bottom decoration */}
      <div className="mt-auto pt-6 border-t border-pink-200/50">
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-xs font-bold text-pink-500 mb-1">Need Help?</div>
          <div className="text-[10px] text-pink-900/70 mb-3">Contact the IT Service Desk</div>
          <button className="w-full py-1.5 text-xs font-bold text-white bg-gradient-to-r from-pink-400 to-pink-500 rounded-full shadow-sm hover:shadow-soft transition-shadow">
            Support
          </button>
        </div>
      </div>
    </aside>
  );
}
