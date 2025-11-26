import { Routes, Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router-dom";
import Approve from "../pages/Approve";
import Projects from "../pages/Projects";

import Trash from "../pages/Trash";
import AdminProfile from "../pages/AdminProfile";
import ApprovedUser from "../pages/ApprovedUser";
import RejectedUser from "../pages/RejectedUser";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/approve"
        element={
          <ProtectedRoute>
            <Approve />
          </ProtectedRoute>
        }
      />

         <Route
        path="/trash"
        element={
          <ProtectedRoute>
            <Trash />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

       <Route
        path="/approved-users"
        element={
          <ProtectedRoute>
            <ApprovedUser />
          </ProtectedRoute>
        }
      />

       <Route
        path="/rejected-users"
        element={
          <ProtectedRoute>
            <RejectedUser />
          </ProtectedRoute>
        }
        />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRouter;
