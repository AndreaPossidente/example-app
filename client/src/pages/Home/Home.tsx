import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "@/api/axios";

import UsersTable from "@components/UsersTable";
import useAuth from "@hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);

  const getUsers = async () => {
    const { data } = await axios.get("/api/users");
    setUsers(data);
  };

  const updateUsers = async (data: User[]) => {
    if (data) {
      setUsers(data);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
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
          {users && (
            <div>
              <div className="flex gap-2 justify-between items-center">
                <h2 className="text-lg font-bold mb-2">Manage Users</h2>
                <span className="text-xs font-bold text-blue-800 cursor-pointer">
                  Add User
                </span>
              </div>
              <UsersTable updateUsers={updateUsers} users={users} />
            </div>
          )}
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
