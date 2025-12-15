// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosClient from "../api/axiosClient";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      loading: false,
      error: null,

      // -------------------------
      // LOGIN
      // -------------------------
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });

          const response = await axiosClient.post("/auth/login", {
            email,
            password,
          });

          const { token, user } = response.data;

          // Normalize backend role to frontend-friendly role strings
          const mapRole = (r) => {
            if (!r) return null;
            const R = r.toString().toUpperCase();
            if (R === 'ADMIN') return 'admin';
            if (R === 'HOSPITAL_COORDINATOR' || R === 'COORDINATOR') return 'coordinator';
            if (R === 'DOCTOR') return 'doctor';
            if (R === 'RECIPIENT') return 'recipient';
            return R.toLowerCase();
          };

          set({
            token,
            user,
            role: mapRole(user.role),
            loading: false,
          });

          return { success: true };
        } catch (err) {
          set({
            error: err.response?.data?.message || "Login failed",
            loading: false,
          });
          return { success: false };
        }
      },

      // -------------------------
      // REGISTER USER (Admin creates other accounts)
      // -------------------------
      registerUser: async (data) => {
        try {
          set({ loading: true, error: null });

          const response = await axiosClient.post("/auth/register", data);

          set({ loading: false });
          return { success: true, message: response.data.message };
        } catch (err) {
          set({
            error: err.response?.data?.message || "Registration failed",
            loading: false,
          });
          return { success: false };
        }
      },

      // -------------------------
      // LOGOUT
      // -------------------------
      logout: () =>
        set({
          user: null,
          token: null,
          role: null,
        }),

      // -------------------------
      // AUTO LOAD / RESTORE STATE
      // -------------------------
      loadUserFromStorage: () => {
        const state = get();
        if (state.token && !state.user) {
          // Optionally fetch profile here
          // axiosClient.get("/auth/me")
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
