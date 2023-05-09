import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import UsersTable from "./UsersTable/UsersTable";

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

  const updateUsers = async (data: User[]) => {
    if (data) {
      setUsers(data);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      getUsers();
    }
  }, [user]);

  return (
    <div>
      {!user && (
        <div className="h-screen w-full flex gap-2 justify-center items-center">
          <Link to="/login" className="font-bold text-blue-800">
            Login
          </Link>
          or
          <Link to="/signup" className="font-bold text-blue-800">
            Sign Up
          </Link>
        </div>
      )}
      {user && (
        <div className="h-screen w-full flex flex-col gap-5 justify-center items-center">
          <div>
            Logged in as <b>{user.username}</b>
            <span className="text-xs pl-1">{user.role}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">Manage Users</h2>
            {users && <UsersTable updateUsers={updateUsers} users={users} />}
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
