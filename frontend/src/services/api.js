/**
 * API Service
 * -----------
 * Axios instance with JWT interceptor and helpers for auth, incidents, admin.
 */

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Inject Authorization header from localStorage on every request.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ─────────────────────────────────────────────────────────────
export const signup = (data) => API.post("/auth/signup", data);
export const login  = (data) => API.post("/auth/login", data);
export const getMe  = ()     => API.get("/auth/me");

// ── Incidents (user-scoped) ──────────────────────────────────────────
export const getIncidents    = ()           => API.get("/incidents/");
export const getIncident     = (id)         => API.get(`/incidents/${id}`);
export const createIncident  = (data)       => API.post("/incidents/", data);

// ── Admin ────────────────────────────────────────────────────────────
export const adminGetIncidents    = ()           => API.get("/admin/incidents");
export const adminUpdateIncident  = (id, data)   => API.put(`/admin/incidents/${id}`, data);
export const adminDeleteIncident  = (id)         => API.delete(`/admin/incidents/${id}`);
export const adminGenerateReport  = ()           => API.get("/admin/generate-report");
export const getAnalytics         = ()           => API.get("/admin/analytics");

export default API;
