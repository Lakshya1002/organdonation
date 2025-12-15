import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiChevronDown, FiLogOut } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useState, useRef, useEffect } from "react";

export default function Topbar() {
  const { user, role, logout } = useAuthStore();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const pageTitle = location.pathname
    .split("/")
    .pop()
    ?.replace("-", " ")
    ?.toUpperCase();

  /* CLICK OUTSIDE TO CLOSE (POLISH DETAIL) */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="
        relative h-20 px-8 flex items-center justify-between
        bg-gradient-to-r from-white/85 via-white/80 to-white/75
        backdrop-blur-xl
        border-b border-slate-200/70
        shadow-[0_6px_24px_rgba(0,0,0,0.06)]
        sticky top-0 z-40
      "
    >
      {/* LEFT — PAGE CONTEXT */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-lg font-bold text-slate-800 tracking-wide"
        >
          {pageTitle || "DASHBOARD"}
        </motion.h1>
        <p className="text-[11px] text-slate-400 uppercase tracking-widest">
          {role} portal
        </p>
      </div>

      {/* RIGHT — ACTIONS */}
      <div className="flex items-center gap-6">

        {/* NOTIFICATIONS */}
        <button
          className="
            relative text-slate-500 hover:text-slate-700
            transition duration-300
          "
          aria-label="Notifications"
        >
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* USER MENU */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="
              flex items-center gap-3
              bg-white/70 hover:bg-white/90
              px-3 py-2 rounded-xl
              border border-white/60
              transition duration-300
            "
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {/* AVATAR */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {user?.name ? user.name.slice(0, 2) : "MD"}
            </div>

            {/* NAME + ROLE */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-700 truncate max-w-[120px]">
                {user?.name || "Medical Staff"}
              </p>
              <p className="text-xs text-slate-400 capitalize">
                {role}
              </p>
            </div>

            {/* CHEVRON */}
            <FiChevronDown
              className={`
                text-slate-400 transition-transform duration-300
                ${open ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* DROPDOWN */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="
                  absolute right-0 mt-3 w-48
                  bg-white/95 backdrop-blur-xl
                  border border-white/60
                  rounded-xl shadow-xl
                  overflow-hidden
                "
              >
                <button
                  onClick={logout}
                  className="
                    w-full flex items-center gap-3
                    px-4 py-3 text-sm
                    text-slate-600 hover:text-red-600
                    hover:bg-red-50
                    transition duration-300
                  "
                >
                  <FiLogOut />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SYSTEM ACCENT — HORIZONTAL (MATCHES SIDEBAR EXACTLY) */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500/50 via-cyan-400/40 to-transparent pointer-events-none z-20" />
    </header>
  );
}
