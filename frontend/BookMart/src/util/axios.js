import axios from "axios";

// Determine base URL: use env variable, or fallback based on environment
const getBaseURL = () => {
  // Check for environment variables first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback: localhost for dev, vercel for prod
  if (import.meta.env.DEV) {
    return "http://localhost:5000/api/v1";
  }
  
  return "https://book-store-exv9.vercel.app/api/v1";
};

const baseURL = getBaseURL();

console.log("🌐 Frontend API Configuration:", {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  finalBaseURL: baseURL,
  isDev: import.meta.env.DEV,
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
