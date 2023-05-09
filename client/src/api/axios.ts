import axios from "axios";
import Cookies from "js-cookie";

const { VITE_SERVER_URL = "http://localhost:4000" } = import.meta.env;

const token = Cookies.get("jwt");

axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

export default axios.create({
  baseURL: VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
