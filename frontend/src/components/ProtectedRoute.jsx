// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ allowedRoles }) {
  const { token, role } = useAuthStore();

  const mapRole = (r) => {
    if (!r) return null;
    const R = r.toString().toUpperCase();
    if (R === 'ADMIN') return 'admin';
    if (R === 'HOSPITAL_COORDINATOR' || R === 'COORDINATOR') return 'coordinator';
    if (R === 'DOCTOR') return 'doctor';
    if (R === 'RECIPIENT') return 'recipient';
    return R.toLowerCase();
  };

  const effectiveRole = mapRole(role);

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(effectiveRole))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
