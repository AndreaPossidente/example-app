import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import axios from "@/api/axios";

import type { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { refresh, reset } from "../store/slices/authSlice";

export default function useAuth() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [error, setError] = useState<string>("");

  const token = Cookies.get("jwt");

  useEffect(() => {
    dispatch(refresh());
  }, [token]);

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
        dispatch(refresh());
      } else {
        setError(JSON.stringify(data));
        dispatch(reset());
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
            dispatch(refresh());
          }
        }
      } else {
        setError(JSON.stringify(data));
        dispatch(reset());
      }
    }
  };

  const logout = () => {
    Cookies.remove("jwt");
    dispatch(reset());
  };

  return { user, error, login, signup, logout };
}
