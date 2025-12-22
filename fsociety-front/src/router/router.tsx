import { createBrowserRouter } from "react-router-dom";
import { SignUp } from "../pages/SignUp/SignUp";
import { Login } from "../pages/Login/Login";

export const router = createBrowserRouter([
  { index: true, element: <SignUp /> },
  { index: true, element: <SignUp />, path: "signup" },
  { element: <Login />, path: "login" },
]);
