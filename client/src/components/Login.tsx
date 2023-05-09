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
    <div className="flex justify-center items-center w-full h-screen">
      {!user && (
        <div className="flex flex-col justify-center items-center gap-1">
          <h1>Accedi</h1>
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
          {error && <div>{error}</div>}
          <button type="submit" onClick={() => login(username, password)}>
            Login
          </button>

          <span>
            Don't have an account yet? <Link to="/signup">Sign Up</Link>
          </span>
        </div>
      )}
    </div>
  );
}
