import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Animation library
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import useAuthStore from "../store/authStore"; 

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(null); // To track which input is focused

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (!res.success) return;

    const role = useAuthStore.getState().role;
    // Simulate a slight delay for smooth exit animation (optional)
    setTimeout(() => {
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "coordinator") navigate("/coordinator/dashboard");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else navigate("/");
    }, 500);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">

    {/* BACKGROUND BLOBS — REFINED */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-blue-200/60 rounded-full blur-[140px] animate-blob" />
      <div className="absolute top-[-20%] right-[-10%] w-[520px] h-[520px] bg-cyan-200/60 rounded-full blur-[140px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-25%] left-[25%] w-[520px] h-[520px] bg-indigo-200/60 rounded-full blur-[160px] animate-blob animation-delay-4000" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="relative z-10 w-full max-w-6xl bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.25)] border border-white/60 overflow-hidden grid grid-cols-1 lg:grid-cols-5"
    >

      {/* LEFT — BRANDING (POLISHED, SAME SOUL) */}
      <div className="hidden lg:flex lg:col-span-2 flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">

        {/* Grid texture — softer */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10">
          <motion.div
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
              <div className="h-4 w-4 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-wide">ORGANOVA</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-extrabold leading-tight"
          >
            Ethical.<br />
            Transparent.<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Life-Saving.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-7 text-slate-300 text-sm leading-relaxed"
          >
            Secure access to Organova’s organ allocation platform.
            Every action is immutable, audited, and ethically governed.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10"
        >
          <div className="flex items-center gap-2 mb-1">
            <FiCheckCircle className="text-green-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
              System Secure
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Encrypted connection • Audit-compliant
          </p>
        </motion.div>
      </div>

      {/* RIGHT — FORM (REFINED, NOT SIMPLIFIED) */}
      <div className="lg:col-span-3 p-8 md:p-12 flex items-center justify-center bg-white/60">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              Welcome Back
            </h2>
            <p className="text-slate-500 mt-2">
              Sign in to continue to your dashboard
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div
                  role="alert"
                  aria-live="assertive"
                  className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-sm"
                >
                  <FiAlertCircle className="text-lg shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative mt-1 group">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
                  placeholder="name@hospital.org"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                  Forgot Password?
                </a>
              </div>
              <div className="relative mt-1 group">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full mt-4 bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/25 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20 disabled:opacity-70 transition"
            >
              {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Sign In"}
            </motion.button>

          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400">
              All access attempts are logged and monitored
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  </div>
);

}