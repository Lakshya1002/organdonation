import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import DashboardCard from "../components/dashboard/DashboardCard";
import MiniChart from "../components/dashboard/MiniChart";

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

  if (loading) return <p>Loading...</p>;
  if (!stats) return <p>Error loading dashboard data</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-4 gap-6">
        <DashboardCard title="Total Donors" value={stats.totalDonors} icon="🫀" />
        <DashboardCard title="Total Recipients" value={stats.totalRecipients} icon="🧑‍⚕️" />
        <DashboardCard title="Total Organs" value={stats.totalOrgans} icon="🩺" />
        <DashboardCard title="Transplants Completed" value={stats.totalMatches || stats.totalTransplants} icon="✔️" />
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        <MiniChart label="Donors" value={stats.totalDonors} />
        <MiniChart label="Recipients" value={stats.totalRecipients} />
        <MiniChart label="Organs Available" value={stats.totalOrgans} />
      </div>
    </div>
  );
}
