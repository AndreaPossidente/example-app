import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useInput from "../hooks/useInput";

export default function Login() {
  const { login, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const { data: username, handler: handleUsername } = useInput();
  const { data: password, handler: handlePassword } = useInput();

  return (
    <div className="flex justify-center items-center h-screen">
      {!user && (
        <div className="flex flex-col justify-center items-center gap-2 w-2xl">
          <h1 className="text-2xl font-bold mb-4">Accedi</h1>
          <input
            className="w-full"
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsername}
          />
          <input
            className="w-full"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handlePassword}
            value={password}
          />
          {error && <div className="my-2 text-sm text-red-500">{error}</div>}
          <button type="submit" onClick={() => login(username, password)}>
            Login
          </button>

          <span className="text-sm">
            Don't have an account yet?{" "}
            <Link to="/signup" className="font-bold text-blue-800">
              Sign Up
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
