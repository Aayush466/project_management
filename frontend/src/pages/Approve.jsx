<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useSelector, useDispatch } from "react-redux";
import { setPendingUsers } from "../features/profile/profileSlice";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // 👈 Import motion and AnimatePresence

// --- Framer Motion Variants ---
const mainContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, when: "beforeChildren" } },
};

const listContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.05, // Stagger items by 50ms
    },
  },
};

const listItemVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  // Animation for when an item is removed (approved)
  exit: { 
    opacity: 0, 
    height: 0, 
    paddingTop: 0, 
    paddingBottom: 0, 
    marginBottom: 0,
    transition: { 
        duration: 0.3,
        ease: "easeInOut"
    } 
  },
};
// ------------------------------

export default function Approve() {
  const [openSideBar, setOpenSideBar] = useState(false);
  const isAdmin = useSelector((state) => state.profile?.admin);
  const dispatch = useDispatch();
  const pendingUsers = useSelector(
    (state) => state.profile?.pendingUsers || []
  );
  const navigate = useNavigate();
  const [isApproving, setIsApproving] = useState(false); // New state for loading indicator
  const [isRejecting, setIsRejecting] = useState(false); // New state for loading indicator

  useEffect(() => {
    if (!isAdmin) navigate("/dashboard");
  }, [isAdmin, navigate]);

  // ✅ Approve user handler
  const handleApprove = async (userEmail) => {
    setIsApproving(true);
>>>>>>> shiva
    try {
      // Call your backend API (replace with your real endpoint)
      const response = await axios.post(
        "http://localhost:5000/api/users/approve",
        { email: userEmail },
<<<<<<< HEAD
        {withCredentials:true}
      );

      if (response.data.success) {
        alert("✅ Approved successfully!");
        dispatch(setPendingUsers(pendingUsers.filter(pendingUser=>pendingUser.email!=userEmail)))
=======
        { withCredentials: true }
      );

      if (response.data.success) {
        // No alert needed, the visual transition handles feedback
        dispatch(
          setPendingUsers(
            pendingUsers.filter((pendingUser) => pendingUser.email != userEmail)
          )
        );
>>>>>>> shiva
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Error approving user. Please try again later.");
<<<<<<< HEAD
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
=======
    } finally {
        setIsApproving(false);
    }
  };

    // Reject User
    const handleReject = async (userEmail) => {
    setIsRejecting(true);
    try {
      // Call your backend API (replace with your real endpoint)
      const response = await axios.post(
        "http://localhost:5000/api/users/reject",
        { email: userEmail },
        { withCredentials: true }
      );

      if (response.data.success) {
        // No alert needed, the visual transition handles feedback
        dispatch(
          setPendingUsers(
            pendingUsers.filter((pendingUser) => pendingUser.email != userEmail)
          )
        );
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Rejecting failed:", error);
      alert("Error rejecting user. Please try again later.");
    } finally {
        setIsRejecting(false);
    }
  };


  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={openSideBar} onClose={setOpenSideBar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Topbar userName={"Admin User"} handleOpenSideBar={setOpenSideBar} />

        <motion.div // 👈 Apply main content entrance
          variants={mainContentVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto"
        >
          {/* --- Header --- */}
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8 pb-2 border-b border-gray-200">
            Admin Dashboard
          </h1>

          {/* --- Approve User Requests Section --- */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <span className="mr-3 text-blue-600">👤</span> Approve User Requests
            </h3>

            {/* User List with Staggered Entrance and Exit */}
            <motion.ul 
                className="space-y-4"
                variants={listContainerVariants}
                initial="initial"
                animate="visible"
            >
              <AnimatePresence>
                {pendingUsers.length > 0 ? (
                  pendingUsers.map((pendingUser) => (
                    <motion.li // 👈 Apply item animation
                      key={pendingUser.email}
                      variants={listItemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit" // Use the exit variant for removal
                      // Responsive and styled list item
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 space-y-3 sm:space-y-0"
                    >
                      {/* User Info Group */}
                      <div className="flex items-center space-x-4">
                        {/* Professional Avatar */}
                        <span className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0">
                          {pendingUser.name
                            ? pendingUser.name.charAt(0).toUpperCase()
                            : "U"}
                        </span>

                        {/* Text Area */}
                        <div className="min-w-0">
                          {/* Name - Bolder and larger */}
                          <p className="font-semibold text-gray-800 text-base truncate">
                            {pendingUser.name || "Unknown User"}
                          </p>
                          {/* Email - Subtle and clear, ensures truncation for mobile safety */}
                          <p className="text-sm text-gray-500 truncate">
                            {pendingUser.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap justify-end">
                                              {/* ✅ Approve button */}
                      <motion.button // 👈 Apply button interactions
                        onClick={() => handleApprove(pendingUser.email)}
                        disabled={isApproving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150 flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isApproving ? "Processing..." : "Approve User"}
                      </motion.button>

                                            {/* ✅ Approve button */}
                      <motion.button // 👈 Apply button interactions
                        onClick={() => handleReject(pendingUser.email)}
                        disabled={isRejecting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isRejecting ? "Processing..." : "Rejecting User"}
                      </motion.button>
                        </div>
                    </motion.li>
                  ))
                ) : (
                  // Empty State - Clean and centered
                  <motion.div
                    key="emptyState"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300"
                  >
                    <p className="text-gray-500 font-medium">🎉 No pending users to approve!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.ul>
          </div>
        </motion.div>
      </div>
     
    </div>
  );
}
>>>>>>> shiva
