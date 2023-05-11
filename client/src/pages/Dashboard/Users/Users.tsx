import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "@/api/axios";

import UsersTable from "@components/UsersTable";

export default function Users() {
  const user = useOutletContext<Session | null>();
  const [users, setUsers] = useState<User[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      getUsers();
    } else {
      navigate("/admin");
    }
  }, [user, navigate]);

  const getUsers = async () => {
    const { data } = await axios.get("/api/users");
    setUsers(data);
  };

  return (
    <div>
      <span className="text-xs text-slate-400">
        <Link
          to="/admin"
          className="cursor-pointer text-cyan-700 transition hover:text-cyan-500"
        >
          Dashboard
        </Link>{" "}
        » Users
      </span>
      <h1 className="text-lg">Users</h1>
      {!user && (
        <div className="w-full flex gap-2 items-center">
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
        <div className="mt-10 w-full flex flex-col gap-5 justify-center items-center">
          {users && (
            <div className="w-full">
              <UsersTable updateUsers={getUsers} users={users} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
