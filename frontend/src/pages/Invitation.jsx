import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Mail } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../features/profile/profileSlice";
import axios from "axios"; // Don't forget to import axios

const Invitation = () => {
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();

  useEffect(() => {}, [user]);

  const accept = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/accept-invite",
        { email },
        { withCredentials: true }
      );

      console.log("Invite accepted successfully:", response.data);

      // Filter out the accepted invitation from the list of invitations
      const updatedInvitations = user.invitations.filter(
        (invitation) => invitation.admin.email !== email
      );

      // Optionally update the state in Redux or locally
      dispatch(setProfile({ ...user, invitations: updatedInvitations }));

      // Re-fetch the user profile to ensure it's up-to-date
      const res = await fetch("http://localhost:5000/api/users/profile", {
        credentials: "include", // include cookies if needed
      });

      const data = await res.json();

      if (data?.success && data?.data?._id) {
        // User is authenticated, update Redux state with the latest user data
        dispatch(setProfile(data.data));
      }

      return response.data;
    } catch (error) {
      console.error(
        "Error accepting invite:",
        error.response?.data || error.message
      );
    }
  };

  const reject = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/reject-invite",
        { email },
        { withCredentials: true }
      );

      console.log("Invitation has been rejected:", response.data);

      // Optionally remove the rejected invitation from the UI
      const updatedInvitations = user.invitations.filter(
        (invitation) => invitation.admin.email !== email
      );

      dispatch(setProfile({ ...user, invitations: updatedInvitations }));

      return response.data;
    } catch (error) {
      console.error(
        "Error rejecting invite:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 space-y-6">
        <Topbar userName={user.name} />

        <h1 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
          Notifications
        </h1>

        <div className="bg-white shadow rounded-xl p-6">
          {user.invitations.length === 0 && (
            <p className="text-gray-500 text-center py-10">No notifications</p>
          )}

          <ul className="space-y-4">
            {user.invitations.map((invitation, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-4 rounded-lg border bg-blue-50 border-blue-200"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="text-blue-500" />
                  <div>
                    <p className="text-gray-700">
                      {invitation.admin.name} sent you an invitation
                    </p>
                    <span className="text-xs text-gray-400">
                      {invitation.invitedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => accept(invitation.admin.email)} // Accept the invitation
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => reject(invitation.admin.email)} // Reject the invitation
                    className="text-red-500 hover:text-red-700"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Invitation;