import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import BoardView from "./List"; // Import the board view component
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../features/profile/profileSlice";

// --- START: BoardListAndCreate ---
const BoardListAndCreate = ({
  boards,
  onCreateBoard,
  onDeleteBoard,
  onOpenBoard,
}) => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {/* Render existing boards */}
      {boards &&
        boards.length > 0 &&
        boards.map((board) => (
          <div
            key={board._id}
            onClick={() => onOpenBoard(board._id)}
            className="group relative w-52 h-32 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            {/* Delete Icon (visible only on hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBoard(board._id);
              }}
              className="absolute top-2 right-2 hidden group-hover:flex items-center justify-center bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-all duration-200"
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
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null); // store full board details

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

      const updatedProfile = {
        ...userProfile,
        myBoards: [...userProfile.myBoards, createdBoard],
      };

      dispatch(setProfile(updatedProfile));

      if (response.data.success) {
        alert("Board created successfully!");
        await fetchProfile();
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

  // Delete a board
  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;

    try {
      setDeleting(true);
      const response = await axios.delete(
        `http://localhost:5000/api/boards/${boardId}`,
        { withCredentials: true }
      );

      const updatedProfile = {
        ...userProfile,
        myBoards: userProfile.myBoards.filter((item) => item._id !== boardId),
      };

      dispatch(setProfile(updatedProfile));

      if (response.data.success) {
        alert("Board deleted successfully!");
        await fetchProfile();
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

  // ✅ Open a board (API CALL to fetch board details)
  const handleOpenBoard = async (boardId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/boards/${boardId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log(response.data.data);

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

  const handleBackToDashboard = () => {
    setSelectedBoard(null);
  };

  // --- Loading / Error States ---
  if (loading && !selectedBoard) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-600 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-red-600 text-lg font-medium">{error}</div>
      </div>
    );
  }

  // --- Render BoardView if a board is selected ---
  if (selectedBoard) {
    return (
      <BoardView
        boardData={selectedBoard}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  // --- Render Dashboard View ---
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

          <BoardListAndCreate
            boards={boards}
            onCreateBoard={handleCreateBoard}
            onDeleteBoard={handleDeleteBoard}
            onOpenBoard={handleOpenBoard}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutWithBoardList;
