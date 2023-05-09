import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import axios from "../api/axios";

interface Session {
  userId: number;
  username: string;
  role: string;
  permissions: string[];
  iat: number;
}

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
      const res = await axios
        .post("/login", {
          username: username,
          password: password,
        })
        .catch((error) => {
          setError(error.response.data.msg);
        });

      if (res.data["token"]) {
        const token = Cookies.get("jwt");
        if (token) {
          const user: Session | null = decodeToken(token);
          if (user) {
            setUser(user);
          }
        }
      } else {
        setError(JSON.stringify(res));
        setUser(null);
      }
    }
  };

  const signup = async (username: string, password: string) => {
    if (username && password) {
      const res = await axios
        .post("/signup", {
          username: username,
          password: password,
        })
        .catch((error) => {
          setError(error.response.data.msg);
        });

      if (res.data["token"]) {
        const token = Cookies.get("jwt");
        if (token) {
          const user: Session | null = decodeToken(token);
          if (user) {
            setUser(user);
          }
        }
      } else {
        setError(JSON.stringify(res));
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
