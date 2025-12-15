import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 overflow-hidden">

        <Topbar />

        {/* PAGE CONTENT */}
        <div className="p-6 overflow-auto flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
