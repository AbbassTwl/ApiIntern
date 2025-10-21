import { Navigate, Outlet } from "react-router-dom";

function hasToken() {
  return typeof window !== "undefined" && !!localStorage.getItem("token");
}

export function ProtectedRoute() {
  return hasToken() ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  return hasToken() ? <Navigate to="/" replace /> : <Outlet />;
}
