/**
 * TicketCard Component
 * --------------------
 * Renders a single incident card with priority badge.
 * Clicking navigates to the ticket details page.
 */

import React from "react";
import { useNavigate } from "react-router-dom";

const PRIORITY_COLORS = {
  High:   "bg-pink-500 text-white shadow-sm border border-pink-600",
  Medium: "bg-pink-300 text-pink-900 shadow-sm border border-pink-400",
  Low:    "bg-pink-100 text-pink-600 shadow-sm border border-pink-200",
};

const STATUS_COLORS = {
  "Open":        "bg-white text-pink-500 border border-pink-200 shadow-sm text-xs px-2.5 py-1",
  "In Progress": "bg-pink-400 text-white border border-pink-500 shadow-sm text-xs px-2.5 py-1",
  "Resolved":    "bg-green-100 text-green-600 border border-green-200 shadow-sm text-xs px-2.5 py-1",
};

function timeAgo(dateStr) {
  const diff = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000));
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function TicketCard({ incident }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tickets/${incident.id}`)}
      className="glass-card rounded-2xl p-5 cursor-pointer hover:-translate-y-1 hover:border-pink-300 hover:shadow-soft transition-all duration-300 animate-fade-in group"
      id={`ticket-${incident.id}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-sm text-pink-900 group-hover:text-pink-500 transition-colors truncate mr-3">{incident.title}</span>
        <span className="text-[11px] text-pink-400 font-mono font-semibold bg-pink-50 px-2 py-0.5 rounded-full flex-shrink-0">#{incident.id}</span>
      </div>

      {/* Description */}
      {incident.description && (
        <p className="text-xs text-pink-900/70 mb-4 line-clamp-2 leading-relaxed">{incident.description}</p>
      )}
      
      {/* Assignee if any */}
      {incident.assignee_name && (
        <div className="mb-4 flex items-center gap-2">
           <div className="w-5 h-5 rounded-full bg-pink-200 flex items-center justify-center text-[9px] font-bold text-pink-700">
              {incident.assignee_name.charAt(0).toUpperCase()}
           </div>
           <span className="text-[10px] font-semibold text-pink-600">Assigned: {incident.assignee_name}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 flex-wrap mt-auto">
        <span className={`text-[10px] font-bold uppercase tracking-widest rounded-full ${PRIORITY_COLORS[incident.priority]} px-3 py-1`}>
          {incident.priority}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-widest rounded-full ${STATUS_COLORS[incident.status]}`}>
          {incident.status}
        </span>
        <span className="text-[10px] font-medium text-pink-400 ml-auto flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {timeAgo(incident.created_at)}
        </span>
      </div>
    </div>
  );
}
