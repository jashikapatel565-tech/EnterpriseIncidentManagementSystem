/**
 * TicketForm Component
 * --------------------
 * Incident submission form. user_id is auto-set from JWT.
 */

import React, { useState } from "react";
import { createIncident } from "../services/api";

export default function TicketForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setSuccess(false);
    try {
      await createIncident({ title, description, priority });
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setSuccess(true);
      if (onCreated) onCreated();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to create incident:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 shadow-soft relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-[40px] pointer-events-none" />

      <h2 className="text-lg font-bold text-pink-900 flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shadow-sm">
          <span className="text-pink-500">📝</span>
        </div>
        Submit Incident
      </h2>

      <form onSubmit={handleSubmit} id="ticket-submit-form" className="space-y-5 relative z-10">
        <div>
          <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Title</label>
          <input
            id="incident-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief summary of the issue..."
            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-pink-200 text-pink-900 placeholder-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 outline-none transition-all text-sm font-medium shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Description</label>
          <textarea
            id="incident-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide additional details..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-pink-200 text-pink-900 placeholder-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 outline-none transition-all text-sm font-medium shadow-sm resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Priority</label>
          <select
            id="incident-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-pink-200 text-pink-900 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 outline-none transition-all text-sm font-medium shadow-sm appearance-none"
          >
            <option value="Low" className="font-semibold text-pink-900">🟢 Low Priority</option>
            <option value="Medium" className="font-semibold text-pink-900">🟠 Medium Priority</option>
            <option value="High" className="font-semibold text-pink-900">🔴 High Priority</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-400 hover:to-pink-300 text-white font-bold text-sm transition-all hover:-translate-y-1 shadow-glow hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-4"
          id="submit-incident-btn"
        >
          {submitting ? "Submitting..." : "Submit Incident"}
        </button>
      </form>

      {success && (
        <div className="mt-6 bg-green-50 text-green-600 text-sm font-bold rounded-xl px-4 py-4 border border-green-200 flex items-center justify-center gap-2 animate-fade-in shadow-sm relative z-10">
          <span className="text-xl">✨</span> Incident submitted successfully!
        </div>
      )}
    </div>
  );
}
