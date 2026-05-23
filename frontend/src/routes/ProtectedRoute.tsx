import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAppStore } from "../stores/appStore";
import { Role } from "../types/domain";

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user, isAuthenticated } = useAuth();
  const { pageAccess } = useAppStore();
  const location = useLocation();
  const dynamicRoles = pageAccess[location.pathname];
  const allowed =
    user &&
    (!roles || roles.includes(user.role)) &&
    (!dynamicRoles || dynamicRoles.includes(user.role));

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowed) {
    return <Navigate to="/profile" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
