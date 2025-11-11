import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setProfile,setPendingUsers, setAdmin,setTrashBoards,setTrashCards,setTrashLists } from "../features/profile/profileSlice";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("loading"); // "loading" | "authenticated" | "unauthenticated"
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true, // ✅ includes cookies (like tokens)
        });

        if (res.data?.success && res.data?.data?._id) {
          // ✅ User authenticated
          dispatch(setProfile(res.data.data));
          dispatch(setAdmin(res.data.admin));
          dispatch(setPendingUsers(res.data.pendingUsers?res.data.pendingUsers:[]))
          dispatch(setPendingUsers(res.data.pendingUsers?res.data.pendingUsers:[]))
          dispatch(setTrashCards(res.data.trashCards?res.data.trashCards:[]))
          dispatch(setTrashLists(res.data.trashLists?res.data.trashLists:[]))
          dispatch(setTrashBoards(res.data.trashBoards?res.data.trashBoards:[]))
          
          console.log(res.data.pendingUsers)
          
          setAuthState("authenticated");
        } else {
          // ❌ Not authenticated
          setAuthState("unauthenticated");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthState("unauthenticated");
        navigate("/login");
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  // While checking authentication
  if (authState === "loading") {
    return (
      <div className="text-center mt-8 text-gray-600">
        Checking authentication...
      </div>
    );
  }

  // If authenticated, render children; else navigate handled already
  return children;
};

export default ProtectedRoute;
