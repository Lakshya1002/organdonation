import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import DashboardCard from "../components/dashboard/DashboardCard";

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await axiosClient.get("/patients/summary-coordinator");
      setStats(res.data);
    } catch (err) {
      console.error("Coordinator Dashboard Error:", err);
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
      <h2 className="text-2xl font-bold mb-6">Coordinator Dashboard</h2>

      <div className="grid grid-cols-2 gap-6">
        <DashboardCard title="Pending Patients" value={stats.pendingRecipients} icon="🧍" />
        <DashboardCard title="Available Organs" value={stats.availableOrgans} icon="🫁" />
      </div>
    </div>
  );
}
