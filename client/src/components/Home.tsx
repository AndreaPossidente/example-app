import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  permissions: string[];
}

export default function Home() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);

  const token = Cookies.get("jwt");
  const headers: { authorization?: string; "Content-Type": string } = token
    ? {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      }
    : {
        "Content-Type": "application/json",
      };

  const getUsers = async () => {
    const res = await fetch("http://localhost:4000/users", {
      headers,
    });
    const data = await res.json();

    setUsers(data);
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      getUsers();
    }
  }, [user]);

  return (
    <div>
      {!user && (
        <div className="h-screen w-full flex gap-3 justify-center items-center">
          <Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link>
        </div>
      )}
      {user && (
        <div className="h-screen w-full flex flex-col gap-5 justify-center items-center">
          <div>Logged in as {user.username}</div>
          <div>
            You are a {user.role} and can {JSON.stringify(user.permissions)}
          </div>
          <div>
            {users &&
              users.map((user) => (
                <div>
                  {user.username} - {user.role}
                </div>
              ))}
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
