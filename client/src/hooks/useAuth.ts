import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";

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
    const token = Cookies.get("jwt");
    const headers: { authorization?: string; "Content-Type": string } = token
      ? {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        }
      : {
          "Content-Type": "application/json",
        };
    if (username && password) {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (data["token"]) {
        const token = Cookies.get("jwt");
        if (token) {
          const user: Session | null = decodeToken(token);
          if (user) {
            setUser(user);
          }
        }
      } else {
        setError(data.msg);
        setUser(null);
      }
    }
  };

  const signup = async (username: string, password: string) => {
    const token = Cookies.get("jwt");
    const headers: { authorization?: string; "Content-Type": string } = token
      ? {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        }
      : {
          "Content-Type": "application/json",
        };
    if (username && password) {
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (data["token"]) {
        const token = Cookies.get("jwt");
        if (token) {
          const user: Session | null = decodeToken(token);
          if (user) {
            setUser(user);
          }
        }
      } else {
        setError(data.msg);
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
