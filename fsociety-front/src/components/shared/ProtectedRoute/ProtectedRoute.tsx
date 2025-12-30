import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";

export function ProtectedRoute() {
  const isAuthorized = useAppSelector((state) => state.auth.isAuthorized);
  console.log("IS AUTH: ", isAuthorized);
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
}
