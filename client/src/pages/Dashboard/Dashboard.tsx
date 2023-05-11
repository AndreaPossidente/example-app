import Sidebar from "@/components/Sidebar/Sidebar";
import { TbBell, TbSettings } from "react-icons/tb";
import { BiMessageDetail } from "react-icons/bi";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { MdLogout } from "react-icons/md";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="ml-[250px] pr-5 h-14 border-b flex items-center justify-between">
        <div className="h-full min-w-[50%]">
          <input
            type="search"
            className="h-full w-full py-4 px-3 border-r transition duration-100 focus:outline-0 focus:bg-indigo-50"
            placeholder="Cerca..."
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer transition-transform hover:scale-105">
            <TbBell size={22} className="cursor-pointer stroke-slate-700" />
            <span className="absolute -right-1 -top-1 bg-red-600 text-white rounded-full text-[7px] w-[13px] h-[13px] flex justify-center items-center">
              15
            </span>
          </div>
          <div className="relative cursor-pointer transition-transform hover:scale-105">
            <BiMessageDetail
              size={22}
              className="cursor-pointer stroke-slate-700"
            />
            <span className="absolute -right-1 -top-1 bg-red-600 text-white rounded-full text-[7px] w-[13px] h-[13px] flex justify-center items-center">
              3
            </span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="w-[30px] h-[30px] rounded-full bg-zinc-300"></div>
            <div className="font-bold text-sm [line-height:0.9rem] flex flex-col justify-center text-slate-700">
              {user && user.username}
              <span className="font-normal text-xs [line-height:0.8rem] text-slate-400">
                {user && user.role}
              </span>
            </div>
          </div>
          <div
            className="relative cursor-pointer transition-transform hover:scale-105"
            onClick={logout}
          >
            <MdLogout size={22} className="cursor-pointer stroke-slate-700" />
          </div>
          <div className="relative cursor-pointer transition-transform hover:scale-105">
            <TbSettings
              size={22}
              className="cursor-pointer stroke-slate-700 transition-transform duration-[2s] hover:rotate-180"
            />
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-3.5rem)] ml-[250px] p-3 overflow-y-auto">
        <Outlet context={user} />
      </div>
    </main>
  );
}
