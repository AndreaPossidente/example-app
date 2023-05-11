import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Home() {
  const user = useOutletContext<Session | null>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <span className="text-xs text-slate-400">Dashboard</span>
      <h1 className="text-lg">Welcome to your dashboard, {user?.username}.</h1>
    </div>
  );
}
