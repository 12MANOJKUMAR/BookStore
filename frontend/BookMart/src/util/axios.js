import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:1000/api/v1",
  withCredentials: true, // ✅ send HttpOnly cookie automatically
});

export default api;
