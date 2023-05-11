import axios from "@/api/axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function Roles() {
  const [roles, setRoles] = useState<Role[] | null>(null);
  const user = useOutletContext<Session | null>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/admin");
    } else {
      getRoles();
    }
  }, [user, navigate]);

  const getRoles = async () => {
    const { data } = await axios("/api/roles");
    setRoles(data);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full">
      <span className="text-xs text-slate-400">
        <Link
          to="/admin"
          className="cursor-pointer text-cyan-700 transition hover:text-cyan-500"
        >
          Dashboard
        </Link>{" "}
        » Roles
      </span>
      <h1 className="text-lg">Roles</h1>
      {roles && (
        <table className="border rounded-lg mt-5 w-full">
          <thead className="rounded-lg bg-zinc-200">
            <tr>
              <td className="p-1">name</td>
              <td className="p-1">permissions</td>
            </tr>
          </thead>
          <tbody>
            {roles.map((role: Role) => (
              <tr key={`role_${role.name}`}>
                <td className="p-1">{role.name}</td>
                <td className="text-sm p-1">
                  {role.permissions.map((p) => (
                    <div>
                      <input type="checkbox" />
                      <label className="ml-1">{p.name}</label>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
