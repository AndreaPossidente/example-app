import { Link, useLocation } from "react-router-dom";
import { GoDashboard } from "react-icons/go";
import { HiOutlineLockClosed, HiOutlineUsers } from "react-icons/hi";
import useAuth from "@/hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="fixed top-0 left-0 bottom-0 w-[250px] border-r max-h-screen">
      <div className="w-full h-14 px-3 border-b flex justify-center items-center text-lg font-bold">
        Logo
      </div>
      <nav className="w-full overflow-x-hidden  max-h-[calc(100vh-3.5rem)] overflow-y-auto">
        <ul className="flex flex-col w-full">
          <span className="text-sm px-2 pt-4 pb-2">Home</span>
          <Link
            to="/admin"
            className={`px-2 py-2 m-1 transition-all hover:bg-slate-200 rounded-lg ${
              pathname === "/admin" ? "bg-slate-200" : undefined
            }`}
          >
            <li className="py-1 flex gap-2 font-medium items-center">
              <GoDashboard size={18} /> Dashboard
            </li>
          </Link>
          {user?.role === "admin" && (
            <>
              <span className="text-sm px-2 py-2">Manage</span>
              <Link
                to="/admin/users"
                className={`px-2 py-2 m-1 transition-all hover:bg-slate-200 rounded-lg ${
                  pathname === "/admin/users" ? "bg-slate-200" : undefined
                }`}
              >
                <li className="py-1 flex gap-2 font-medium items-center">
                  <HiOutlineUsers size={18} /> Users
                </li>
              </Link>
              <Link
                to="/admin/roles"
                className={`px-2 py-2 m-1 transition-all hover:bg-slate-200 rounded-lg ${
                  pathname === "/admin/roles" ? "bg-slate-200" : undefined
                }`}
              >
                <li className="py-1 flex gap-2 font-medium items-center">
                  <HiOutlineLockClosed size={18} /> Roles
                </li>
              </Link>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
