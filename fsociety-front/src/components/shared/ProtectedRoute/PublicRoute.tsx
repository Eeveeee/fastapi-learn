import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";

export function PublicRoute() {
  const isAuthorized = useAppSelector((state) => state.auth.isAuthorized);
  if (isAuthorized) {
    return <Navigate to="/users" replace />;
  }

  return <Outlet />;
}
