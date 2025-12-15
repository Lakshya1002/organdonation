import React from "react";

export default function DashboardCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 text-2xl">
          {icon}
        </div>
      </div>
      
      {/* Optional Trend Indicator */}
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          <span className="text-green-500 font-medium">↑ {trend}%</span>
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
}