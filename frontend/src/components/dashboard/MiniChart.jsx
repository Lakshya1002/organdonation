import React from "react";

export default function MiniChart({ label, value }) {
  return (
    <div className="bg-white p-4 shadow rounded-xl">
      <h4 className="text-sm text-gray-500">{label}</h4>
      <p className="text-xl font-semibold mt-2">{value}</p>
    </div>
  );
}
