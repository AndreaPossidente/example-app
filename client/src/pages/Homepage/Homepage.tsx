import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className="h-screen w-full flex justify-center items-center gap-2">
      <Link className="px-2 py-1 border rounded-lg" to="/login">
        Login
      </Link>
      or
      <Link className="px-2 py-1 border rounded-lg" to="/signup">
        Signup
      </Link>
    </div>
  );
}
