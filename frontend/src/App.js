// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

import AdminDashboard from "./pages/AdminDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Matching from "./pages/Matching";

import Donors from "./pages/Donors";
import Recipients from "./pages/Recipients";
import Organs from "./pages/Organs";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast Notification Provider */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "coordinator", "doctor"]} />}>
          <Route element={<MainLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/donors" element={<Donors />} />
            <Route path="/admin/recipients" element={<Recipients />} />
            <Route path="/admin/organs" element={<Organs />} />
            
            <Route path="/matching" element={<Matching />} />
            
            <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}