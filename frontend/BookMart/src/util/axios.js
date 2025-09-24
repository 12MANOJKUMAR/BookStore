import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1000/api/v1",
  withCredentials: true, // ✅ send HttpOnly cookie automatically
});

export default api;
