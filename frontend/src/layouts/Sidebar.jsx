import React from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { 
  FiHome, 
  FiUsers, 
  FiDatabase, 
  FiActivity, 
  FiHeart, 
  FiSettings,
  FiLifeBuoy
} from "react-icons/fi";

export default function Sidebar() {
  const { role } = useAuthStore();

  // Styles for the links
  const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm mb-1";
  
  // Active: Blue background, white text, subtle shadow
  const activeClass = `${baseClass} bg-blue-600 text-white shadow-md shadow-blue-200`;
  
  // Inactive: Gray text, hover effect
  const inactiveClass = `${baseClass} text-slate-500 hover:bg-blue-50 hover:text-blue-700`;

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 z-20">
      
      {/* 1. BRAND HEADER */}
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <FiActivity className="text-xl" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Organova</span>
        </div>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        
        {/* ADMIN SECTION */}
        {role === "admin" && (
          <div className="mb-8">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Administration</p>
            
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
              <FiHome className="text-lg" /> Dashboard
            </NavLink>
            
            <NavLink to="/admin/donors" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
              <FiHeart className="text-lg" /> Donor Registry
            </NavLink>
            
            <NavLink to="/admin/recipients" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
              <FiUsers className="text-lg" /> Recipients List
            </NavLink>
            
            <NavLink to="/admin/organs" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
              <FiDatabase className="text-lg" /> Organ Bank
            </NavLink>
          </div>
        )}

        {/* CLINICAL SECTION */}
        {(role === "admin" || role === "doctor" || role === "coordinator") && (
          <div className="mb-8">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Clinical Ops</p>
            
            <NavLink to="/matching" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
              <FiActivity className="text-lg" /> AI Matching
            </NavLink>

            {role === "doctor" && (
              <NavLink to="/doctor/dashboard" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                <FiHome className="text-lg" /> My Dashboard
              </NavLink>
            )}

             {role === "coordinator" && (
              <NavLink to="/coordinator/dashboard" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                <FiHome className="text-lg" /> Coordinator View
              </NavLink>
            )}
          </div>
        )}

        {/* SETTINGS SECTION (Placeholder for now) */}
        <div>
           <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">System</p>
           <button className={inactiveClass + " w-full"}>
             <FiSettings className="text-lg" /> Settings
           </button>
           <button className={inactiveClass + " w-full"}>
             <FiLifeBuoy className="text-lg" /> Support
           </button>
        </div>

      </nav>

      {/* 3. FOOTER STATUS */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full opacity-50 animate-ping"></div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">System Online</p>
              <p className="text-[10px] text-slate-500">v2.4.0 • Stable</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}