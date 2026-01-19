import axios from "axios";

// Prefer environment variable, fallback to Vercel production API
const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "https://book-store-exv9.vercel.app/api/v1";

console.log("🌐 Frontend API Configuration:", {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  finalBaseURL: baseURL,
  isProd: import.meta.env.PROD
});

// In production, enforce HTTPS to ensure cookies with SameSite=None; Secure are sent
if (import.meta.env.PROD && !baseURL.startsWith("https://")) {
  console.warn("VITE_API_BASE_URL is not HTTPS in production. Update it to an https:// URL to send secure cookies.");
}

const api = axios.create({
  baseURL,
  withCredentials: true, // send HttpOnly cookie automatically
});

export default api;
