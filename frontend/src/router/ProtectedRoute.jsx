import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Step 1: Try to verify current session
        const res = await fetch("http://localhost:8000/api/v1/users/check", {
          credentials: "include", // send cookies
        });

        if (res.status === 200) {
          const data = await res.json();
          if (data?.data?.isAuthenticated) {
            setAuthState("authenticated");
            return;
          }
        }

        // Step 2: If not authenticated, try refreshing token
        const refreshRes = await axios.post(
          "http://localhost:8000/api/v1/users/refresh-token",
          {},
          { withCredentials: true }
        );

        if (refreshRes?.data?.isAuthenticated) {
          setAuthState("authenticated");
        } else {
          setAuthState("unauthenticated");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthState("unauthenticated");
      }
    };

    checkAuth();
  }, []); // Run once

  if (authState === "loading") {
    return <div>Loading...</div>;
  }

  return authState === "authenticated" ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
