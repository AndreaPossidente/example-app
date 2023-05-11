import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import useInput from "@hooks/useInput";

interface AuthProps {
  variant: "login" | "signup";
}

export default function Auth({ variant = "login" }: AuthProps) {
  const { login, signup, error, user } = useAuth();
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
          <h1 className="text-2xl font-bold mb-4">
            {variant === "login" ? "Login" : "Sign Up"}
          </h1>
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
          <button
            type="submit"
            onClick={() =>
              variant === "login"
                ? login(username, password)
                : signup(username, password)
            }
          >
            {variant === "login" ? "Login" : "Sign Up"}
          </button>

          <span className="text-sm">
            {variant === "login" ? (
              <>
                Don't have an account yet?{" "}
                <Link to="/signup" className="font-bold text-blue-800">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-blue-800">
                  Login
                </Link>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
