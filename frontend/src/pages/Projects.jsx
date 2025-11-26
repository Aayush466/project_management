<<<<<<< HEAD
import React, { useEffect, useState } from "react";
=======
import { useState,useEffect } from "react";
>>>>>>> shiva
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import BoardView from "./List"; // Import the board view component
import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD
import { setProfile } from "../features/profile/profileSlice";

// --- START: BoardListAndCreate ---
=======
import { setBoards, setProfile, setTrashBoards } from "../features/profile/profileSlice";
import { motion, AnimatePresence } from "framer-motion"; // 👈 Import motion and AnimatePresence

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const layoutVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
// ------------------------------

// --- START: BoardListAndCreate (Animated Component) ---
>>>>>>> shiva
const BoardListAndCreate = ({
  boards,
  onCreateBoard,
  onDeleteBoard,
  onOpenBoard,
}) => {
  return (
<<<<<<< HEAD
    <div className="flex flex-wrap gap-4 p-4">
=======
    <motion.div // 👈 Apply container variant for staggered entrance
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
>>>>>>> shiva
      {/* Render existing boards */}
      {boards &&
        boards.length > 0 &&
        boards.map((board) => (
<<<<<<< HEAD
          <div
            key={board._id}
            onClick={() => onOpenBoard(board._id)}
            className="group relative w-52 h-32 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            {/* Delete Icon (visible only on hover) */}
            <button
=======
          <motion.div // 👈 Apply item variant for each board tile
            key={board._id}
            variants={itemVariants}
            onClick={() => onOpenBoard(board._id)}
            // Apply interaction animations
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full h-36 bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-all duration-300"
          >
            {/* Delete Icon - Visibility logic preserved, now with motion interaction */}
            <motion.button
>>>>>>> shiva
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBoard(board._id);
              }}
<<<<<<< HEAD
              className="absolute top-2 right-2 hidden group-hover:flex items-center justify-center bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-all duration-200"
=======
              whileTap={{ scale: 0.9 }} // Small tap animation on the icon itself
              className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center bg-white text-red-500 rounded-full p-1.5 shadow-md hover:bg-red-50 transition-all duration-300 z-10"
>>>>>>> shiva
              title="Delete board"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m1-2a1 1 0 011-1h6a1 1 0 011 1v2"
                />
              </svg>
<<<<<<< HEAD
            </button>

            {/* Blue Header Section */}
            <div className="h-3/5 bg-blue-600"></div>

            {/* White Footer Section with Board Name */}
            <div className="h-2/5 p-3 flex items-center border-t border-gray-100">
              <span className="text-gray-800 font-medium text-sm truncate">
                {board.title || "Untitled Board"}
              </span>
            </div>
          </div>
        ))}

      {/* Always show Create New Board option */}
      <div
        onClick={onCreateBoard}
        className="w-52 h-32 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md flex flex-col justify-center items-center text-center p-4 cursor-pointer transition-colors duration-200"
      >
        <span className="text-gray-700 font-medium text-base">
          Create new board
        </span>
      </div>
    </div>
  );
};
// --- END: BoardListAndCreate ---

// --- Dashboard Layout (Main Component) ---
const DashboardLayoutWithBoardList = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
=======
            </motion.button>

            {/* Accent Header Section - Softer, more professional color */}
            <div className="h-3/5 bg-blue-500/80 p-3 flex items-center">
              {/* Optional: Add an icon or pattern here */}
            </div>

            {/* White Footer Section with Board Name - More padding and clearer text */}
            <div className="h-2/5 p-4 flex flex-col justify-end">
              <span className="text-gray-800 font-semibold text-lg truncate">
                {board.title || "Untitled Board"}
              </span>
            </div>
          </motion.div>
        ))}

      {/* Always show Create New Board option */}
      <motion.div
        onClick={onCreateBoard}
        variants={itemVariants} // Apply item variant for staggered entrance
        whileHover={{ scale: 1.03 }} // Add hover interaction
        whileTap={{ scale: 0.98 }} // Add tap interaction
        className="w-full h-36 bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-100 rounded-xl flex flex-col justify-center items-center text-center p-4 cursor-pointer transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-blue-500 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="text-blue-600 font-medium text-base">
          Create new board
        </span>
      </motion.div>
    </motion.div>
  );
};

// --- Dashboard Layout (Main Component) ---
const DashboardLayoutWithBoardList = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const dispatch = useDispatch();
  const globalBoards = useSelector(state => state.profile.boards);
  const globalTrashBoards = useSelector(state => state.profile.trashBoards);
  const [boards, setLocalBoards] = useState(globalBoards);
  const [loading, setLoading] = useState(false);
>>>>>>> shiva
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null); // store full board details

<<<<<<< HEAD
  let userProfile = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();

  // Fetch user profile and boards
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Error fetching user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Create new board
  const handleCreateBoard = async () => {
=======
  // Fetch boards on mount or when globalBoards changes
  useEffect(() => {
      setLocalBoards(globalBoards);
  }, [globalBoards]);


  // Create new board (function logic remains the same)
  const handleCreateBoard = async () => {
    // ... (logic remains the same)
>>>>>>> shiva
    const title = prompt("Enter board title:");
    if (!title || title.trim() === "") {
      alert("Board title is required!");
      return;
    }

    try {
      setCreating(true);
      const response = await axios.post(
        "http://localhost:5000/api/boards",
        { title },
        { withCredentials: true }
      );

      const createdBoard = response.data.data;
<<<<<<< HEAD

      const updatedProfile = {
        ...userProfile,
        myBoards: [...userProfile.myBoards, createdBoard],
      };

      dispatch(setProfile(updatedProfile));

      if (response.data.success) {
        alert("Board created successfully!");
        await fetchProfile();
=======
      const updatedBoards = [...boards, createdBoard];
      setLocalBoards(updatedBoards);
      dispatch(setBoards(updatedBoards));

      if (response.data.success) {
        alert("Board created successfully!");
>>>>>>> shiva
      } else {
        alert("Failed to create board");
      }
    } catch (err) {
      console.error("Error creating board:", err);
      alert("Error creating board");
    } finally {
      setCreating(false);
    }
  };

<<<<<<< HEAD
  // Delete a board
  const handleDeleteBoard = async (boardId) => {
=======
  // Delete a board (function logic remains the same)
  const handleDeleteBoard = async (boardId) => {
    // ... (logic remains the same)
>>>>>>> shiva
    if (!window.confirm("Are you sure you want to delete this board?")) return;

    try {
      setDeleting(true);
      const response = await axios.delete(
        `http://localhost:5000/api/boards/${boardId}`,
        { withCredentials: true }
      );

<<<<<<< HEAD
      const updatedProfile = {
        ...userProfile,
        myBoards: userProfile.myBoards.filter((item) => item._id !== boardId),
      };

      dispatch(setProfile(updatedProfile));

      if (response.data.success) {
        alert("Board deleted successfully!");
        await fetchProfile();
=======
      const deletedBoard = boards.filter((item) => item._id === boardId)[0];
      const updatedBoards = boards.filter((item) => item._id !== boardId);
      
      setLocalBoards(updatedBoards);
      dispatch(setBoards(updatedBoards));
      dispatch(setTrashBoards([...globalTrashBoards, deletedBoard]));

      if (response.data.success) {
        alert("Board deleted successfully!");
>>>>>>> shiva
      } else {
        alert("Failed to delete board");
      }
    } catch (err) {
      console.error("Error deleting board:", err);
      alert("Error deleting board");
    } finally {
      setDeleting(false);
    }
  };

<<<<<<< HEAD
  // ✅ Open a board (API CALL to fetch board details)
  const handleOpenBoard = async (boardId) => {
=======
  // Open a board (function logic remains the same)
  const handleOpenBoard = async (boardId) => {
    // ... (logic remains the same)
>>>>>>> shiva
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/boards/${boardId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
<<<<<<< HEAD
        console.log(response.data.data);

=======
>>>>>>> shiva
        setSelectedBoard(response.data.data); // store the entire board object
      } else {
        alert("Failed to open board");
      }
    } catch (err) {
      console.error("Error opening board:", err);
      alert("Error opening board");
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleBackToDashboard = () => {
    setSelectedBoard(null);
  };

  // --- Loading / Error States ---
  if (loading && !selectedBoard) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-600 text-lg font-medium">Loading...</div>
=======
  // --- Loading State with Animation ---
  if (loading && !selectedBoard) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600 text-lg font-medium"
        >
          <span className="animate-spin mr-3 inline-block">⚙️</span> Loading board...
        </motion.div>
>>>>>>> shiva
      </div>
    );
  }

<<<<<<< HEAD
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-red-600 text-lg font-medium">{error}</div>
      </div>
    );
  }

  // --- Render BoardView if a board is selected ---
=======
  // --- Render BoardView if a board is selected (No motion needed here as BoardView handles its own view) ---
>>>>>>> shiva
  if (selectedBoard) {
    return (
      <BoardView
        boardData={selectedBoard}
<<<<<<< HEAD
        onBackToDashboard={handleBackToDashboard}
=======
        setSelectedBoard={setSelectedBoard}
>>>>>>> shiva
      />
    );
  }

  // --- Render Dashboard View ---
<<<<<<< HEAD
  const boards = userData?.myBoards.filter(myBoard=>myBoard.trash==false) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Topbar />
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Your Workspaces
          </h1>

          {(creating || deleting) && (
            <div className="text-blue-600 mb-4">
              {creating ? "Creating board..." : "Deleting board..."}
            </div>
          )}
=======
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={openSideBar} onClose={setOpenSideBar} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Topbar handleOpenSideBar={setOpenSideBar} />

        <motion.div // 👈 Apply layout entrance animation
          className="p-4 md:p-8 w-full max-w-7xl mx-auto"
          variants={layoutVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
            Your Workspaces
          </h1>

          <AnimatePresence>
            {(creating || deleting) && (
              <motion.div // 👈 Apply status banner animation
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6"
              >
                <span className="mr-2 animate-pulse">
                  {creating ? "✨" : "🗑️"}
                </span>
                {creating ? "Creating new board, please wait..." : "Deleting board, moving to trash..."}
              </motion.div>
            )}
          </AnimatePresence>
>>>>>>> shiva

          <BoardListAndCreate
            boards={boards}
            onCreateBoard={handleCreateBoard}
            onDeleteBoard={handleDeleteBoard}
            onOpenBoard={handleOpenBoard}
          />
<<<<<<< HEAD
        </div>
=======
        </motion.div>
>>>>>>> shiva
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default DashboardLayoutWithBoardList;
=======
export default DashboardLayoutWithBoardList;
>>>>>>> shiva
