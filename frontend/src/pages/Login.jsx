// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore"; // Correct import

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await login(email, password);

    if (!res.success) return;

    const role = useAuthStore.getState().role;

    // Redirect based on role
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "coordinator") navigate("/coordinator/dashboard");
    else if (role === "doctor") navigate("/doctor/dashboard");
    else navigate("/");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
