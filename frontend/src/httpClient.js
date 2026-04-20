import axios from "axios";

const defaultUrl =
  import.meta.env.MODE === "development"
    ? "http://127.0.0.1:5000"
    : "https://ai-medlab-server.vercel.app";

const url = (import.meta.env.VITE_BACKEND_URL || defaultUrl).replace(/\/$/, "");

export default axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    // "Authorization": "Bearer " + localStorage.getItem("token")
  },
  baseURL: url,
  timeout: 10000
}); 