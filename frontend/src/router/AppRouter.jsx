import { Routes, Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import TeamPage from "../pages/TeamPage";
import Projects from "../pages/Projects";
import Notifications from "../pages/Notifications";
import Invitation from "../pages/Invitation";

import TasksPage from "../pages/TaskPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <TeamPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invitation"
        element={
          <ProtectedRoute>
            <Invitation />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRouter;
