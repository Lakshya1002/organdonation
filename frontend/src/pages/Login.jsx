import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { FiLock, FiMail, FiArrowRight } from "react-icons/fi";

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
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "coordinator") navigate("/coordinator/dashboard");
    else if (role === "doctor") navigate("/doctor/dashboard");
    else navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* Left Side - Hero Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 overflow-hidden items-center justify-center">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Medical Team" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-800/90 mix-blend-multiply"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 px-16 text-white max-w-2xl">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-blue-200 uppercase border border-blue-400 rounded-full bg-blue-900/30 backdrop-blur-sm">
            Secure Medical Portal
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white drop-shadow-sm">
            Advanced Organ <br/> <span className="text-blue-300">Matching System</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-10 opacity-90">
            Organova leverages cutting-edge AI to streamline the donation process, 
            ensuring organs reach those in need with unprecedented speed and fairness.
          </p>

          <div className="grid grid-cols-2 gap-8 border-t border-blue-400/30 pt-8">
            <div>
              <p className="text-4xl font-bold text-white">2.4k+</p>
              <p className="text-blue-300 text-sm font-medium uppercase tracking-wide mt-1">Lives Saved</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">98%</p>
              <p className="text-blue-300 text-sm font-medium uppercase tracking-wide mt-1">Match Accuracy</p>
            </div>
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-slate-500">Please enter your credentials to access the dashboard.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r shadow-sm flex items-start animate-fade-in">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="text-lg"/>
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
                  placeholder="doctor@hospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-lg"/>
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <FiArrowRight className="ml-2 text-lg" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400">
              Authorized personnel only. Access is monitored and logged. <br/>
              © 2024 Organova Inc. v2.4.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}