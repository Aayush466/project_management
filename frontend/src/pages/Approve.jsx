import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useSelector,useDispatch } from "react-redux";
import { setPendingUsers } from "../features/profile/profileSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Approve() {
  const isAdmin = useSelector((state) => state.profile?.admin);
  const dispatch = useDispatch();
  const pendingUsers = useSelector((state) => state.profile?.pendingUsers || []);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Pending Users:", pendingUsers);
    if (!isAdmin) navigate("/dashboard");
  }, [isAdmin, navigate, pendingUsers]);

  // ✅ Approve user handler
  const handleApprove = async (userEmail) => {
    try {
      // Call your backend API (replace with your real endpoint)
      const response = await axios.post(
        "http://localhost:5000/api/users/approve",
        { email: userEmail },
        {withCredentials:true}
      );

      if (response.data.success) {
        alert("✅ Approved successfully!");
        dispatch(setPendingUsers(pendingUsers.filter(pendingUser=>pendingUser.email!=userEmail)))
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Error approving user. Please try again later.");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Topbar */}
        <Topbar userName={"Admin User"} />

        {/* Approve User Requests Section */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Approve User Requests
          </h3>

          {/* User List */}
          <ul className="space-y-4">
            {pendingUsers.length > 0 ? (
              pendingUsers.map((pendingUser, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {pendingUser.name
                        ? pendingUser.name.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">
                        {pendingUser.name || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {pendingUser.email}
                      </p>
                    </div>
                  </div>

                  {/* ✅ Approve button with onClick */}
                  <button
                    onClick={() => handleApprove(pendingUser.email)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150"
                  >
                    Approve
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No pending users to approve.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
