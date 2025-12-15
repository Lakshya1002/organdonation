import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import DashboardCard from "../components/dashboard/DashboardCard";

export default function DoctorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await axiosClient.get("/patients/summary-doctor");
      setStats(res.data);
    } catch (err) {
      console.error("Doctor Dashboard Error:", err);
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
      <h2 className="text-2xl font-bold mb-6">Doctor Dashboard</h2>

      <div className="grid grid-cols-2 gap-6">
        <DashboardCard title="Patients Waiting" value={stats.alivePatients} icon="🧑‍⚕️" />
        <DashboardCard title="Total Transplants" value={stats.transplantsDone} icon="✔️" />
      </div>
    </div>
  );
}
