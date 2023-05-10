import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import axios from "../api/axios";

export default function useAuth() {
  const [user, setUser] = useState<Session | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const user: Session | null = decodeToken(token);
      if (user) {
        setUser(user);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    if (username && password) {
      const data = await axios
        .post("/api/auth/login", {
          username: username,
          password: password,
        })
        .then((res) => res.data)
        .catch((error) => {
          setError(error.response.data.msg);
        });

      if (data["token"]) {
        const token = Cookies.get("jwt");
        if (token) {
          const user: Session | null = decodeToken(token);
          if (user) {
            setUser(user);
          }
        }
      } else {
        setError(JSON.stringify(data));
        setUser(null);
      }
    }
  };

  const signup = async (username: string, password: string) => {
    if (username && password) {
      const data = await axios
        .post("/api/auth/signup", {
          username: username,
          password: password,
        })
        .then((res) => res.data)
        .catch((error) => {
          setError(error.response.data.msg);
        });

      if (data["token"]) {
        const token = Cookies.get("jwt");
        if (token) {
          const user: Session | null = decodeToken(token);
          if (user) {
            setUser(user);
          }
        }
      } else {
        setError(JSON.stringify(data));
        setUser(null);
      }
    }
  };

  const logout = () => {
    Cookies.remove("jwt");
    setUser(null);
  };

  return { user, error, login, signup, logout };
}
