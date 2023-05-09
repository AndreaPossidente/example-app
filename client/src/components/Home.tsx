import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div>
      {!user && (
        <div>
          <Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link>
        </div>
      )}
      {user && (
        <>
          <div>Logged in as {user.username}</div>
          <div>You can {JSON.stringify(user.permissions)}</div>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}
