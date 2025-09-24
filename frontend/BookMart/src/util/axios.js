import axios from "axios";

const api = axios.create({
  baseURL: "https://bookstore-uoyi.onrender.com/api/v1",
  withCredentials: true, // ✅ send HttpOnly cookie automatically
});

export default api;
