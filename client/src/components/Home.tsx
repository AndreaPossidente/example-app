import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div>
      {!user && <Link to="/login">Login</Link>}

      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
}
