import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../features/profile/profileSlice";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("loading");
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          credentials: "include", // include cookies if needed
        });

        const data = await res.json();

        if (data?.success && data?.data?._id) {
          // ✅ User is authenticated
            dispatch(setProfile(data.data))
          setAuthState("authenticated");

        } else {
          // ❌ Not authenticated
          setAuthState("unauthenticated");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthState("unauthenticated");
      }
    };

    checkAuth();
  }, []);

  // Show loading state while checking auth
  if (authState === "loading") {
    return <div className="text-center mt-8 text-gray-600">Checking authentication...</div>;
  }

  // If authenticated → render children, else redirect to login
  return children;
};


export default ProtectedRoute;
