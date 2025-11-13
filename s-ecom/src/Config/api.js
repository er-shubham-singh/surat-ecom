import axios from "axios";

// ✅ Use correct Vite environment variable syntax
export const API_BASE_URL = import.meta.env.VITE_React_BASE_API_URL;

console.log("🌐 Base API URL:", API_BASE_URL);

// ✅ Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
