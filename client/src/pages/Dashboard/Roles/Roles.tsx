import { useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function Roles() {
  const user = useOutletContext<Session | null>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
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
    </div>
  );
}
