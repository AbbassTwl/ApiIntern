import { AuthClient } from "../Client/Auth.client";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return (
    <header className="sticky top-0 z-50 border-2 border-black bg-gray-300 shadow-md flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-black">
          <Link to="/">Phone Store</Link>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {!token ? (
          <>
            <Link to="/login" className="px-3 py-1 rounded-lg border">Sign in</Link>
            <Link to="/register" className="px-3 py-1 rounded-lg border">Register</Link>
          </>
        ) : (
          <button
            onClick={() => { AuthClient.logout(); nav("/login"); }}
            className="px-3 py-1 rounded-lg border"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
