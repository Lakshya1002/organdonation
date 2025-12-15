import React from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

export default function Topbar() {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      <h3 className="text-xl font-semibold text-gray-700">Dashboard</h3>

      <div className="flex items-center gap-4">

        <span className="text-gray-600">{user?.email}</span>

        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          {role}
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <FiLogOut /> Logout
        </button>

      </div>
    </div>
  );
}
