import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import {
  FiHome,
  FiUsers,
  FiDatabase,
  FiActivity,
  FiHeart,
  FiSettings,
  FiLifeBuoy,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

/* ---------------- CONFIG ---------------- */
const NAV_SECTIONS = [
  {
    category: "Main",
    roles: ["admin"],
    items: [
      { to: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
      { to: "/admin/donors", icon: FiHeart, label: "Donor Registry" },
      { to: "/admin/recipients", icon: FiUsers, label: "Recipients List" },
      { to: "/admin/organs", icon: FiDatabase, label: "Organ Bank" },
    ]
  },
  {
    category: "Clinical",
    roles: ["admin", "doctor", "coordinator"],
    items: [
      { to: "/matching", icon: FiActivity, label: "AI Matching" },
      { to: "/doctor/dashboard", icon: FiHome, label: "My Dashboard", roles: ["doctor"] },
      { to: "/coordinator/dashboard", icon: FiHome, label: "Coordinator View", roles: ["coordinator"] },
    ]
  },
  {
    category: "System",
    roles: ["admin", "doctor", "coordinator", "user"],
    items: [
      { to: "/settings", icon: FiSettings, label: "Settings" },
      { to: "/support", icon: FiLifeBuoy, label: "Support" },
    ]
  }
];

export default function Sidebar() {
  const { role, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`
        relative flex flex-col h-screen shrink-0
        bg-gradient-to-b from-white/85 via-white/75 to-white/70
        backdrop-blur-xl
        border-r border-slate-200/70
        transition-all duration-300
        ${isCollapsed ? "w-20" : "w-72"}
      `}
    >
      {/* SYSTEM ACCENT — VERTICAL */}
      <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-blue-500/50 via-cyan-400/40 to-transparent pointer-events-none z-20" />

      {/* SIDEBAR TOGGLE — PRECISION CONTROL */}
<div className="absolute top-8 right-[-14px] z-30">
  <button
    onClick={() => setIsCollapsed(!isCollapsed)}
    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    className="
      relative h-8 w-14
      rounded-full
      bg-white/80 backdrop-blur-xl
      border border-slate-200/70
      shadow-md
      flex items-center
      transition-all duration-300
      hover:bg-white
    "
  >
    {/* SLIDER TRACK GLOW */}
    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-400/10 opacity-0 hover:opacity-100 transition" />

    {/* ARROW KNOB */}
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`
        relative z-10 h-6 w-6 rounded-full
        bg-gradient-to-br from-blue-500 to-cyan-400
        shadow-lg
        flex items-center justify-center
        text-white
        ${isCollapsed ? "ml-[30px]" : "ml-1"}
      `}
    >
      <motion.div
        animate={{ rotate: isCollapsed ? 180 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <FiChevronLeft size={14} />
      </motion.div>
    </motion.span>
  </button>
</div>

      {/* HEADER */}
      <div
        className={`h-20 flex items-center border-b border-slate-200/60 ${
          isCollapsed ? "justify-center" : "px-6"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <div className="h-4 w-4 bg-white rounded-full" />
          </div>

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold text-slate-800">Organova</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">
                {role}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {NAV_SECTIONS.map((section, idx) => {
          if (!section.roles.includes(role)) return null;

          return (
            <div key={idx} className="mb-8">
              {!isCollapsed && (
                <p className="px-6 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.category}
                </p>
              )}

              <div className="px-3 space-y-1">
                {section.items.map((item) => {
                  if (item.roles && !item.roles.includes(role)) return null;
                  return (
                    <NavItem
                      key={item.to}
                      item={item}
                      isCollapsed={isCollapsed}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-200/60 bg-white/60">
        <div className={`flex items-center ${isCollapsed ? "flex-col gap-4" : "gap-3"}`}>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
            {user?.name ? user.name.slice(0, 2) : "MD"}
          </div>

          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-700 truncate">
                {user?.name || "Medical Staff"}
              </p>
              <p className="text-xs text-slate-500 capitalize">{role}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- NAV ITEM ---------------- */
function NavItem({ item, isCollapsed }) {
  return (
    <NavLink
      to={item.to}
      title={isCollapsed ? item.label : ""}
      className={({ isActive }) => `
        relative group flex items-center gap-3 px-3 py-2.5 rounded-xl
        font-medium text-sm transition-all duration-300 ease-out
        ${isCollapsed ? "justify-center" : ""}
        ${isActive ? "text-blue-700" : "text-slate-500 hover:text-slate-900"}
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active Indicator */}
          {isActive && !isCollapsed && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-gradient-to-b from-blue-500 to-cyan-400" />
          )}

          <span
            className={`
              relative z-10 flex items-center justify-center
              ${
                isCollapsed && isActive
                  ? "w-10 h-10 rounded-xl bg-blue-500/15 shadow-inner"
                  : ""
              }
            `}
          >
            <item.icon
              className={`text-lg transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-400 group-hover:text-slate-700"
              }`}
            />
          </span>

          {!isCollapsed && (
            <span className="relative z-10 truncate group-hover:translate-x-0.5 transition-transform">
              {item.label}
            </span>
          )}

          {/* Hover Glow */}
          <span
            className={`
              absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition
              ${isActive
                ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
                : "bg-white/70"}
            `}
          />
        </>
      )}
    </NavLink>
  );
}
