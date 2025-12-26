import { createBrowserRouter } from "react-router-dom";
import { SignUp } from "../pages/SignUp/SignUp";
import { Login } from "../pages/Login/Login";
import { AppBar } from "../components/shared/appBar/AppBar";
import { UsersList } from "../pages/UsersList/UsersList";

export const router = createBrowserRouter([
  {
    element: <AppBar />,
    children: [
      { index: true, element: <SignUp /> },
      { element: <SignUp />, path: "signup" },
      { element: <Login />, path: "login" },
      { element: <UsersList />, path: "users" },
    ],
  },
]);
