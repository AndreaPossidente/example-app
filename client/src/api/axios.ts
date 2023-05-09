import axios from "axios";
import Cookies from "js-cookie";

const { VITE_SERVER_URL = "http://localhost:4000" } = import.meta.env;

const axiosClient = axios.create({
  baseURL: VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosClient;
