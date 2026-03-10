/**
 * TicketFeed Component
 * --------------------
 * Live feed of the current user's incidents. Polls every 5 seconds.
 */

import React, { useEffect, useState, useCallback } from "react";
import { getIncidents } from "../services/api";
import TicketCard from "./TicketCard";

const POLL_INTERVAL = 5000;

export default function TicketFeed({ refreshSignal }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await getIncidents();
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    const timer = setInterval(fetchIncidents, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchIncidents]);

  useEffect(() => {
    if (refreshSignal > 0) fetchIncidents();
  }, [refreshSignal, fetchIncidents]);

  return (
    <div className="glass-card rounded-3xl p-8 shadow-soft" id="ticket-feed-panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-pink-200/50">
        <h2 className="text-lg font-bold text-pink-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shadow-sm">
            <span className="text-pink-500">📋</span>
          </div>
          My Tickets
        </h2>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin" />
        </div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-16 bg-pink-50/50 rounded-2xl border border-pink-200/50">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-pink-900/60 text-sm font-semibold">No incidents reported yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[68vh] overflow-y-auto pr-2 custom-scrollbar">
          {incidents.map((inc) => (
            <TicketCard key={inc.id} incident={inc} />
          ))}
        </div>
      )}
    </div>
  );
}
