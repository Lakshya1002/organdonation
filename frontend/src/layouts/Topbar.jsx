import React from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiBell, FiSearch, FiCalendar, FiUser, FiMenu } from "react-icons/fi";

export default function Topbar() {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white sticky top-0 z-30 border-b border-slate-200 shadow-sm px-6 py-3 flex justify-between items-center transition-all">
      
      {/* LEFT: Context & Date */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger (Visual Only for now) */}
        <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
           <FiMenu className="text-xl" />
        </button>

        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
            {role === 'admin' ? 'Admin Console' : role === 'doctor' ? 'Clinical Dashboard' : 'Overview'}
          </h2>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <FiCalendar className="text-blue-500" />
            <span>{today}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Global Actions & User Profile */}
      <div className="flex items-center gap-3 sm:gap-6">

        {/* Global Search - Hidden on small mobile */}
        <div className="hidden md:flex items-center bg-slate-50 rounded-lg px-3 py-2 w-64 border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <FiSearch className="text-slate-400 mr-2 text-lg" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 border-r border-slate-200 pr-4 mr-2 h-8">
          <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
            <FiBell className="text-lg" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
          </button>
        </div>

        {/* User Profile Dropdown Area */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700 leading-none mb-1">{user?.name || user?.email?.split('@')[0]}</p>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
              role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
              role === 'doctor' ? 'bg-green-50 text-green-600 border-green-100' : 
              'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              {role}
            </span>
          </div>
          
          <div className="relative">
            <div className="h-9 w-9 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-white overflow-hidden">
               {user?.avatar ? (
                 <img src={user.avatar} alt="User" className="h-full w-full object-cover" />
               ) : (
                 <FiUser className="text-sm" />
               )}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <button
            onClick={handleLogout}
            className="ml-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
            title="Logout"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>

      </div>
    </header>
  );
}