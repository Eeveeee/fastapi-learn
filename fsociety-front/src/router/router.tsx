import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignUp } from "../pages/SignUp/SignUp";
import { Login } from "../pages/Login/Login";
import { UsersList } from "../pages/UsersList/UsersList";
import { ProtectedRoute } from "../components/shared/ProtectedRoute/ProtectedRoute";
import { AppBar } from "../components/shared/AppBar/AppBar";
import { UnauthorizedRoute } from "../components/shared/ProtectedRoute/UnauthorizedRoute";
import { useAppSelector } from "../store/hooks";

export function AppRouter() {
  const isAuth = useAppSelector((state) => state.auth);
  console.log("AUTH STATE: ", { ...isAuth });
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout */}
        <Route element={<AppBar />}>
          {/* public */}
          <Route element={<UnauthorizedRoute />}>
            <Route index element={<SignUp />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<Login />} />
          </Route>
          {/* protected */}
          <Route element={<ProtectedRoute />}>
            <Route index path="users" element={<UsersList />} />
          </Route>
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
