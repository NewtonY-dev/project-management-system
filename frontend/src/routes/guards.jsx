import { Navigate, Outlet } from "react-router-dom";
import { dashboardPathForRole, getToken, getUser } from "../api/session";

export function RequireAuth() {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireRole({ role }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }
  return <Outlet />;
}