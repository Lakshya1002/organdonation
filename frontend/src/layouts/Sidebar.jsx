import React from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { FiHome, FiUsers, FiDatabase, FiActivity } from "react-icons/fi";

export default function Sidebar() {
  const { role } = useAuthStore();

  const linkClass =
    "flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-100 transition";

  const activeClass =
    "flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white transition";

  return (
    <div className="w-64 bg-white shadow-xl h-full p-6">

      <h2 className="text-2xl font-bold text-blue-700 mb-8">Organova</h2>

      {/* ADMIN MENU */}
      {role === "admin" && (
        <nav className="space-y-2">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? activeClass : linkClass)}
          >
            <FiHome /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/donors"
            className={({ isActive }) => (isActive ? activeClass : linkClass)}
          >
            <FiUsers /> Donors
          </NavLink>

          <NavLink
            to="/admin/recipients"
            className={({ isActive }) => (isActive ? activeClass : linkClass)}
          >
            <FiUsers /> Recipients
          </NavLink>

          <NavLink
            to="/admin/organs"
            className={({ isActive }) => (isActive ? activeClass : linkClass)}
          >
            <FiDatabase /> Organs
          </NavLink>

          <NavLink
            to="/matching"
            className={({ isActive }) => (isActive ? activeClass : linkClass)}
          >
            <FiActivity /> Matching
          </NavLink>
        </nav>
      )}

      {/* COORDINATOR MENU */}
      {role === "coordinator" && (
        <nav className="space-y-2">

          <NavLink
            to="/coordinator/dashboard"
            className={({ isActive }) => (isActive ? activeClass : linkClass)}
          >
            <FiHome /> Dashboard
          </NavLink>
        </nav>
      )}

      {/* DOCTOR MENU */}
      {role === "doctor" && (
        <nav className="space-y-2">

          <NavLink
            to="/doctor/dashboard"
            className={({ isActive }) => (isActive ? activeClass : linkClass)}
          >
            <FiHome /> Dashboard
          </NavLink>
        </nav>
      )}
    </div>
  );
}
