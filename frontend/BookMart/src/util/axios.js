import axios from "axios";

const api = axios.create({
  baseURL: "https://book-store-exv9.vercel.app/api/v1",
  withCredentials: true, // ✅ send HttpOnly cookie automatically
});

export default api;
