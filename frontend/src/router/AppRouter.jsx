import { Routes, Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRouter;