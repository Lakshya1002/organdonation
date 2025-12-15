import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import DashboardCard from "../components/dashboard/DashboardCard";
// Removed MiniChart for now to keep it clean, can re-add if recharts is installed

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await axiosClient.get("/admin/summary");
      setStats(res.data);
    } catch (err) {
      console.error("Admin Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading dashboard data...</div>;
  if (!stats) return <div className="p-10 text-center text-red-500">Error loading data.</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Total Donors" 
          value={stats.totalDonors} 
          icon="🫀" 
          trend={12} 
        />
        <DashboardCard 
          title="Waiting Recipients" 
          value={stats.totalRecipients} 
          icon="🧍" 
          trend={5} 
        />
        <DashboardCard 
          title="Organs Available" 
          value={stats.totalOrgans} 
          icon="❄️" 
        />
        <DashboardCard 
          title="Transplants Done" 
          value={stats.totalMatches || stats.totalTransplants} 
          icon="✅" 
          trend={8} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64 flex flex-col justify-center items-center text-gray-400">
           <span>Chart Area (Requires Recharts)</span>
        </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64 flex flex-col justify-center items-center text-gray-400">
           <span>Recent Logs</span>
        </div>
      </div>
    </div>
  );
}