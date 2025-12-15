import React from "react";

export default function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
      <div className="text-3xl text-blue-600">{icon}</div>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
