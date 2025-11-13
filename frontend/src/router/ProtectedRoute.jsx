import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setProfile,setPendingUsers, setAdmin,setTrashBoards,setBoards} from "../features/profile/profileSlice";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("loading"); 
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
          dispatch(setTrashBoards(res.data.data.trashBoards))
          dispatch(setBoards(res.data.data.myBoards.filter(board=>!board.trash)))
                    
          setAuthState("authenticated");
        } else {
          // ❌ Not authenticated
          setAuthState("unauthenticated");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking auth at procted route:", error);
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
