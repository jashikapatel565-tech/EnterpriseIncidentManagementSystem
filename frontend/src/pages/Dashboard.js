/**
 * Dashboard Page
 * --------------
 * User dashboard with Navbar + Sidebar layout.
 * Left: TicketForm  |  Right: TicketFeed (own tickets).
 */

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TicketForm from "../components/TicketForm";
import TicketFeed from "../components/TicketFeed";

export default function Dashboard() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const handleCreated = () => setRefreshSignal((p) => p + 1);

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-20 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gradient mb-1">Dashboard Overview</h2>
            <p className="text-pink-900/60 text-sm font-semibold">Track and manage service operations</p>
          </div>
          <div className="bg-white/50 px-4 py-2 rounded-xl border border-pink-200 shadow-sm flex items-center gap-3">
             <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">System Status</span>
             <span className="flex items-center gap-1.5 text-sm font-bold text-green-600"><div className="w-2 h-2 rounded-full bg-green-500"></div> All Systems Operational</span>
          </div>
        </div>

        {/* Top Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Widget 1 */}
          <div className="glass-card rounded-2xl p-6 shadow-soft border-t-4 border-t-pink-400">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs font-bold text-pink-500 uppercase tracking-widest">Active Tickets</div>
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center"><span className="text-pink-500">📥</span></div>
            </div>
            <div className="text-3xl font-extrabold text-pink-900">24</div>
            <div className="text-xs font-semibold text-green-500 mt-2 flex items-center gap-1">↓ 12% from yesterday</div>
          </div>
          
          {/* Widget 2 */}
          <div className="glass-card rounded-2xl p-6 shadow-soft border-t-4 border-t-red-400">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs font-bold text-red-500 uppercase tracking-widest">High Priority</div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"><span className="text-red-500">🔥</span></div>
            </div>
            <div className="text-3xl font-extrabold text-pink-900">5</div>
            <div className="text-xs font-semibold text-red-500 mt-2 flex items-center gap-1">↑ 2 needs attention</div>
          </div>

          {/* Widget 3 */}
          <div className="glass-card rounded-2xl p-6 shadow-soft border-t-4 border-t-green-400">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs font-bold text-green-600 uppercase tracking-widest">Resolved Today</div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><span className="text-green-600">✅</span></div>
            </div>
            <div className="text-3xl font-extrabold text-pink-900">18</div>
            <div className="text-xs font-semibold text-green-500 mt-2 flex items-center gap-1">↑ 4% from yesterday</div>
          </div>

          {/* Widget 4 */}
          <div className="glass-card rounded-2xl p-6 shadow-soft border-t-4 border-t-purple-400">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs font-bold text-purple-600 uppercase tracking-widest">SLA Breaches</div>
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"><span className="text-purple-600">⏱️</span></div>
            </div>
            <div className="text-3xl font-extrabold text-pink-900">0</div>
            <div className="text-xs font-semibold text-purple-500 mt-2 flex items-center gap-1">Perfect score today</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start" id="dashboard">
          <TicketForm onCreated={handleCreated} />
          <TicketFeed refreshSignal={refreshSignal} />
        </div>
      </main>
    </div>
  );
}
