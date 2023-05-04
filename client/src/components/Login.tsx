import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [user, setUser] = useState<any | null>(null);

  const setAuth = async () => {
    const token = Cookies.get("jwt");
    if (token) {
      const user: any = decodeToken(token);
      setUser(user);
    }
  };

  useEffect(() => {
    setAuth();
  }, []);

  const handleLogin = async () => {
    if (username && password) {
      const data = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const res = await data.json();

      if (data.ok) {
        setAuth();
      } else {
        setError(res);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "password") {
      setPassword(e.target.value);
    } else {
      setUsername(e.target.value);
    }
  };

  return (
    <div>
      {!user && (
        <div className="flex flex-col justify-center items-center gap-1">
          <label>Username:</label>
          <input
            onChange={handleInputChange}
            name="username"
            value={username}
            type="text"
          />
          <label>Password:</label>
          <input
            name="password"
            onChange={handleInputChange}
            type="password"
            value={password}
          />
          {error && <span>{JSON.stringify(error)}</span>}
          <button type="submit" onClick={handleLogin}>
            Login
          </button>
        </div>
      )}

      {user && (
        <button
          onClick={() => {
            Cookies.remove("jwt");
            setUser(null);
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}
