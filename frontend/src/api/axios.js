import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // ← changed from 8000 to 5000
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("algou_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
