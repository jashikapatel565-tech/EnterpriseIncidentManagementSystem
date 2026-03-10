/**
 * Admin Dashboard
 * ---------------
 * Admin view: all tickets in table, status update, delete, CSV export.
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  adminGetIncidents,
  adminUpdateIncident,
  adminDeleteIncident,
  adminGenerateReport,
} from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PRIORITY_COLORS = {
  High:   "bg-pink-500 text-white border border-pink-600 shadow-sm",
  Medium: "bg-pink-300 text-pink-900 border border-pink-400 shadow-sm",
  Low:    "bg-pink-100 text-pink-600 border border-pink-200 shadow-sm",
};

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved"];

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportMsg, setReportMsg] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      const res = await adminGetIncidents();
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch admin incidents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const timer = setInterval(fetchAll, 5000);
    return () => clearInterval(timer);
  }, [fetchAll]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminUpdateIncident(id, { status: newStatus });
      fetchAll();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // Add a function to handle assigning tickets to specific users.
  // Assuming there is a static list or an API endpoint to fetch IT staff.
  // For now, we will use a hardcoded mocked user email for testing assignment.
  const handleAssignTicket = async (id) => {
    const assigneeEmail = window.prompt("Enter IT Staff Email to assign this ticket (e.g., it_staff@company.com):");
    if (!assigneeEmail) return;

    // Ideally, we'd lookup user_id by email first, but since the model `IncidentUpdate`
    // accepts `assigned_to` as an integer ID, we need to map the email to an ID.
    // In a real app, this would be a dropdown of IT staff users.
    // For this prototype, I'll prompt for an ID directly to bypass the lookup complexity here.
    const assigneeIdStr = window.prompt(`Enter IT Staff ID for ${assigneeEmail}:`);
    const assigneeId = parseInt(assigneeIdStr, 10);
    if (isNaN(assigneeId)) return;

    try {
      await adminUpdateIncident(id, { assigned_to: assigneeId });
      fetchAll();
      alert(`Assigned ticket #${id} to IT staff member ID: ${assigneeId}`);
    } catch (err) {
      console.error("Assignment failed:", err);
      alert("Assignment failed. Verify user ID exists.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this incident permanently?")) return;
    try {
      await adminDeleteIncident(id);
      fetchAll();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleReport = async () => {
    try {
      const res = await adminGenerateReport();
      setReportMsg(res.data.message);
      setTimeout(() => setReportMsg(""), 4000);
    } catch (err) {
      console.error("Report generation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-20 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-pink-200/50">
          <div>
            <h2 className="text-3xl font-extrabold text-gradient mb-1">Admin Panel</h2>
            <p className="text-pink-900/60 text-sm font-semibold">
              Manage all incidents across the organization
            </p>
          </div>
          <div className="flex items-center gap-3">
            {reportMsg && (
              <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-xl animate-fade-in shadow-sm">
                ✨ {reportMsg}
              </span>
            )}
            <button
              onClick={handleReport}
              className="px-5 py-2.5 rounded-full bg-white border-2 border-pink-200 text-pink-600 font-bold hover:border-pink-400 hover:text-pink-500 hover:shadow-soft transition-all text-sm flex items-center gap-2"
              id="export-report-btn"
            >
              📄 Export CSV
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Tickets", count: incidents.length, color: "text-pink-900", bg: "bg-white/80" },
            { label: "Open Tickets", count: incidents.filter(i => i.status === "Open").length, color: "text-pink-500", bg: "bg-pink-50 border-pink-200" },
            { label: "In Progress", count: incidents.filter(i => i.status === "In Progress").length, color: "text-orange-500", bg: "bg-orange-50 border-orange-200" },
            { label: "Resolved", count: incidents.filter(i => i.status === "Resolved").length, color: "text-green-600", bg: "bg-green-50 border-green-200" },
          ].map((s) => (
            <div key={s.label} className={`glass-card rounded-2xl p-6 shadow-soft border ${s.bg || 'border-white/50'}`}>
              <div className={`text-4xl font-extrabold ${s.color} mb-1 drop-shadow-sm`}>{s.count}</div>
              <div className="text-xs uppercase tracking-widest font-bold text-pink-900/60">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Incidents table */}
        <div className="glass-card rounded-3xl overflow-hidden shadow-soft border border-pink-200/50">
          <div className="px-8 py-5 border-b border-pink-200/50 flex items-center justify-between bg-white/40">
            <h3 className="text-sm font-bold text-pink-900 uppercase tracking-widest">All Incidents</h3>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
              <span className="w-2h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin" />
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-16 text-pink-900/60 font-medium">No incidents found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/40">
                  <tr className="text-[11px] text-pink-400 font-bold uppercase tracking-widest border-b border-pink-200/50">
                    <th className="px-8 py-4">ID</th>
                    <th className="px-8 py-4">Title</th>
                    <th className="px-8 py-4">Submitter</th>
                    <th className="px-8 py-4">Assignee</th>
                    <th className="px-8 py-4">Priority</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {incidents.map((inc) => (
                    <tr
                      key={inc.id}
                      className="hover:bg-white/60 transition-colors animate-fade-in group"
                    >
                      <td className="px-8 py-4 text-pink-400 font-mono text-xs font-semibold">#{inc.id}</td>
                      <td className="px-8 py-4 font-bold text-pink-900 max-w-[200px] truncate">
                        {inc.title}
                      </td>
                      <td className="px-8 py-4 text-pink-900/70 font-medium text-xs">
                        {inc.creator_email || "—"}
                      </td>
                      <td className="px-8 py-4 text-pink-900/70 font-medium text-xs">
                        {inc.assignee_email || "Unassigned"}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${PRIORITY_COLORS[inc.priority]}`}>
                          {inc.priority}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <select
                          value={inc.status}
                          onChange={(e) => handleStatusChange(inc.id, e.target.value)}
                          className="bg-white border border-pink-200 text-pink-900 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 shadow-sm appearance-none cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="font-semibold text-pink-900">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleAssignTicket(inc.id)}
                            className="text-xs font-bold text-pink-500 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg border border-pink-200 transition-colors"
                            title="Assign to IT Staff"
                          >
                            Assign IT
                          </button>
                          <button
                            onClick={() => handleDelete(inc.id)}
                            className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
                            title="Delete incident"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
