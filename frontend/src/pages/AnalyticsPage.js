import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getAnalytics } from "../services/api"; // we'll define this

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAnalytics();
        setAnalytics(res.data);
      } catch (err) {
         setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-20 p-8">
        <div className="mb-8 pb-4 border-b border-pink-200/50">
           <h2 className="text-3xl font-extrabold text-gradient mb-1">System Analytics</h2>
           <p className="text-pink-900/60 text-sm font-semibold">Real-time data visualization and insights</p>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin" />
           </div>
        ) : error ? (
           <div className="text-center py-20 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-200">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Priority Distribution pie chart */}
            <div className="glass-card rounded-3xl p-6 shadow-soft border border-pink-200/50 flex flex-col items-center">
              <h3 className="text-sm font-bold text-pink-900 uppercase tracking-widest mb-6 border-b border-pink-100 pb-2 w-full text-center">Ticket Priority</h3>
              <div className="w-full max-w-[300px]">
                <Pie 
                 data={{
                   labels: ["Low", "Medium", "High"],
                   datasets: [{
                     data: [
                        analytics.by_priority.Low || 0,
                        analytics.by_priority.Medium || 0,
                        analytics.by_priority.High || 0
                     ],
                     backgroundColor: ['#fbcfe8', '#f472b6', '#be185d'],
                     borderColor: '#fff',
                     borderWidth: 2,
                   }]
                 }} 
                 options={{ plugins: { legend: { position: 'bottom' } } }}
                />
              </div>
            </div>

            {/* Status Breakdown bar chart */}
            <div className="glass-card rounded-3xl p-6 shadow-soft border border-pink-200/50 flex flex-col items-center">
               <h3 className="text-sm font-bold text-pink-900 uppercase tracking-widest mb-6 border-b border-pink-100 pb-2 w-full text-center">Ticket Status</h3>
               <div className="w-full h-[300px] flex items-center justify-center">
                 <Bar 
                  data={{
                   labels: ["Open", "In Progress", "Resolved"],
                   datasets: [{
                     label: "Tickets Component",
                     data: [
                        analytics.by_status.Open || 0,
                        analytics.by_status["In Progress"] || 0,
                        analytics.by_status.Resolved || 0
                     ],
                     backgroundColor: '#ff6eb4',
                     borderRadius: 8,
                   }]
                  }} 
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                 />
               </div>
            </div>

            {/* Creation Trends line chart */}
            <div className="glass-card rounded-3xl p-6 shadow-soft border border-pink-200/50 md:col-span-2">
               <h3 className="text-sm font-bold text-pink-900 uppercase tracking-widest mb-6 border-b border-pink-100 pb-2">Tickets Created (Last 7 Days)</h3>
               <div className="w-full h-[300px]">
                 <Line 
                  data={{
                   labels: Object.keys(analytics.by_date || {}),
                   datasets: [{
                     label: "New Tickets",
                     data: Object.values(analytics.by_date || {}),
                     borderColor: '#ff4fa3',
                     backgroundColor: 'rgba(255, 79, 163, 0.2)',
                     fill: true,
                     tension: 0.4,
                     borderWidth: 3,
                     pointBackgroundColor: '#fff',
                     pointBorderColor: '#ff4fa3',
                     pointBorderWidth: 2,
                   }]
                  }} 
                  options={{ responsive: true, maintainAspectRatio: false }}
                 />
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
