import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignUp } from "../pages/SignUp/SignUp";
import { Login } from "../pages/Login/Login";
import { UsersList } from "../pages/UsersList/UsersList";
import { ProtectedRoute } from "../components/shared/ProtectedRoute/ProtectedRoute";
import { AppBar } from "../components/shared/AppBar/AppBar";
import { PublicRoute } from "../components/shared/ProtectedRoute/PublicRoute";
import { NotFound } from "../pages/NotFound/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout */}
        <Route element={<AppBar />}>
          {/* public */}
          <Route element={<PublicRoute />}>
            <Route path="signup" element={<SignUp />} />
            <Route index path="login" element={<Login />} />
            <Route index element={<Navigate to="/login" replace />} />
          </Route>
          {/* protected */}
          <Route element={<ProtectedRoute />}>
            <Route index path="users" element={<UsersList />} />
            <Route index element={<Navigate to="/users" replace />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
