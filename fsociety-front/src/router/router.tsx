import { createBrowserRouter } from "react-router-dom";
import { SignUp } from "../pages/SignUp/SignUp";
import { Login } from "../pages/Login/Login";
import { AppBar } from "../components/shared/appBar/AppBar";

export const router = createBrowserRouter([
  {
    element: <AppBar />,
    children: [
      { index: true, element: <SignUp /> },
      { index: true, element: <SignUp />, path: "signup" },
      { element: <Login />, path: "login" },
    ],
  },
]);
