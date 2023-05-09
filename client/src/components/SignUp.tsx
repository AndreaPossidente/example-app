import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useInput from "../hooks/useInput";

export default function SignUp() {
  const { signup, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const { data: username, handler: handleUsername } = useInput();
  const { data: password, handler: handlePassword } = useInput();

  return (
    <div className="flex justify-center items-center w-full h-screen">
      {!user && (
        <div className="flex flex-col justify-center items-center gap-1">
          <h1>Registrati</h1>
          <label>Username:</label>
          <input
            name="username"
            type="text"
            value={username}
            onChange={handleUsername}
          />
          <label>Password:</label>
          <input
            name="password"
            type="password"
            onChange={handlePassword}
            value={password}
          />
          {error && <span>{JSON.stringify(error)}</span>}
          <button type="submit" onClick={() => signup(username, password)}>
            Sign Up
          </button>

          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      )}
    </div>
  );
}
