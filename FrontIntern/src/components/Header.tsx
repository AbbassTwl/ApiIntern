import { AuthClient } from "../Client/Auth.client";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/useCart";

export function Header() {
  const nav = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAdmin = typeof window !== "undefined" ? localStorage.getItem("isAdmin") === "true" : false;

  const { cartItems } = useCart();
  const totalItems = cartItems.length;

  return (
    <header className="sticky top-0 z-50 border-2 border-black bg-gray-300 shadow-md flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-black">
          <Link to="/">Phone Store</Link>
        </h1>
      </div>

      <div className="flex items-center gap-4">

        {token && !isAdmin && (
          <div
            onClick={() => nav("/cart")}
            className="relative cursor-pointer hover:opacity-80 transition"
          >
            <ShoppingCart size={26} className="text-blue-700" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        )}

        {!token ? (
          <>
            <Link
              to="/login"
              className="px-3 py-1 rounded-lg border border-black text-black hover:bg-gray-200 transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 rounded-lg border border-black text-black hover:bg-gray-200 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              AuthClient.logout();
              localStorage.removeItem("token");
              localStorage.removeItem("isAdmin");
              nav("/login");
            }}
            className="px-3 py-1 rounded-lg border border-black text-black hover:bg-gray-200 transition"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
