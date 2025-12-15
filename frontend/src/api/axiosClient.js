import axios from "axios";
import useAuthStore from "../store/authStore";

const axiosClient = axios.create({
  baseURL: "http://localhost:3001/api",
});

axiosClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = useAuthStore.getState();

    if (error.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
