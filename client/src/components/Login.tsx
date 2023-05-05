import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <div>
      {!user && (
        <div className="flex flex-col justify-center items-center gap-1">
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
          <button type="submit" onClick={() => login(username, password)}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}
