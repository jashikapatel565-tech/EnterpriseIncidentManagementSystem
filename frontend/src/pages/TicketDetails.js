/**
 * Ticket Details Page
 * -------------------
 * Full view of a single ticket with metadata and description.
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIncident } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PRIORITY_COLORS = {
  High:   "bg-pink-500 text-white border border-pink-600 shadow-sm",
  Medium: "bg-pink-300 text-pink-900 border border-pink-400 shadow-sm",
  Low:    "bg-pink-100 text-pink-600 border border-pink-200 shadow-sm",
};

const STATUS_COLORS = {
  "Open":        "bg-white text-pink-500 border border-pink-200 shadow-sm text-xs px-2.5 py-1",
  "In Progress": "bg-pink-400 text-white border border-pink-500 shadow-sm text-xs px-2.5 py-1",
  "Resolved":    "bg-green-100 text-green-600 border border-green-200 shadow-sm text-xs px-2.5 py-1",
};

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getIncident(id);
        setIncident(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load incident");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-20 p-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-bold text-pink-500 hover:text-pink-400 mb-6 flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-full border border-pink-200 shadow-sm inline-flex hover:shadow-soft"
        >
          ← Back to List
        </button>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-200">{error}</div>
        ) : incident && (
          <div className="max-w-4xl animate-fade-in">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
              <div>
                <span className="text-pink-400 text-xs font-mono font-bold bg-white px-2 py-1 rounded-lg border border-pink-200 shadow-sm">Ticket #{incident.id}</span>
                <h2 className="text-3xl font-extrabold text-pink-900 mt-3 mb-4 leading-tight">{incident.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${PRIORITY_COLORS[incident.priority]}`}>
                    {incident.priority}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${STATUS_COLORS[incident.status]}`}>
                    {incident.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Details module */}
            <div className="glass-card rounded-3xl p-8 shadow-soft border border-pink-200/50 relative overflow-hidden">
               {/* Decorative gradient blob */}
               <div className="absolute -top-16 -right-16 w-48 h-48 bg-pink-400/10 rounded-full blur-[60px] pointer-events-none" />

              {/* Description */}
              <div className="mb-8 relative z-10">
                <h3 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="text-lg">📄</span> Description
                </h3>
                <div className="bg-white/60 rounded-2xl p-6 border border-pink-100">
                  <p className="text-pink-900 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {incident.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-pink-200/50 relative z-10">
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <span className="text-pink-500">🕒</span>
                   </div>
                   <div>
                     <span className="text-[10px] text-pink-400 uppercase tracking-widest font-bold">Timeline</span>
                     <p className="text-sm font-semibold text-pink-900 mt-1">Created: {new Date(incident.created_at).toLocaleString()}</p>
                     <p className="text-xs font-medium text-pink-900/60 mt-0.5">Updated: {new Date(incident.updated_at).toLocaleString()}</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <span className="text-pink-500">👤</span>
                   </div>
                   <div>
                     <span className="text-[10px] text-pink-400 uppercase tracking-widest font-bold">Reported By</span>
                     <p className="text-sm font-semibold text-pink-900 mt-1">{incident.creator_name || "Unknown User"}</p>
                     <p className="text-xs font-medium text-pink-900/60 mt-0.5">{incident.creator_email || "No email"}</p>
                   </div>
                </div>

                <div className="flex items-start gap-4 md:col-span-2 bg-pink-50/50 p-4 rounded-2xl border border-pink-100 mt-2">
                   <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 shadow-sm border border-green-200">
                      <span className="text-green-600">🛠️</span>
                   </div>
                   <div>
                     <span className="text-[10px] text-green-600 uppercase tracking-widest font-bold">Assigned IT Staff</span>
                     {incident.assignee_name ? (
                       <>
                         <p className="text-sm font-bold text-pink-900 mt-1">{incident.assignee_name}</p>
                         <p className="text-xs font-medium text-pink-900/60 mt-0.5">{incident.assignee_email}</p>
                       </>
                     ) : (
                       <p className="text-sm font-bold text-pink-900/50 mt-1 italic">Not yet assigned</p>
                     )}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
