import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useSelector, useDispatch } from "react-redux";
import { setTrashBoards } from "../features/profile/profileSlice";
import axios from "axios";

const TrashBoards = ({ boards, onRestore, onPermanentDelete }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {boards &&
        boards.length > 0 &&
        boards.map((board, index) => (
          <div
            key={board.boardId || index}
            className="group relative w-52 h-32 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            {/* Restore Icon (visible only on hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRestore(board.boardId);
              }}
              className="absolute top-2 right-10 hidden group-hover:flex items-center justify-center bg-green-100 text-green-600 rounded-full p-1 hover:bg-green-200 transition-all duration-200"
              title="Restore Board"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-archive-restore"
              >
                <rect width="20" height="5" x="2" y="3" rx="1" />
                <path d="M4 8v11a2 2 0 0 0 2 2h2" />
                <path d="M20 8v11a2 2 0 0 1-2 2h-2" />
                <path d="m9 15 3-3 3 3" />
                <path d="M12 12v9" />
              </svg>
            </button>

            {/* Permanent Delete Icon (visible only on hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPermanentDelete(board.boardId);
              }}
              className="absolute top-2 right-2 hidden group-hover:flex items-center justify-center bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-all duration-200"
              title="Permanently Delete Board"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trash-2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>

            <div className="h-3/5 bg-blue-600"></div>
            <div className="h-2/5 p-3 flex items-center border-t border-gray-100">
              <span className="text-gray-800 font-medium text-sm truncate">
                {board.title || "Untitled Board"}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default function Trash() {
  const dispatch = useDispatch();
  const globalTrashBoards = useSelector((state) => state.profile?.trashBoards || []);

  const [trashBoards, setLocalTrashBoards] = useState(globalTrashBoards);

  useEffect(() => {
    setLocalTrashBoards(globalTrashBoards);
  }, [globalTrashBoards]);

  // Restore board handler
  const handleRestore = async (boardId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/boards/restore/${boardId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Board restored successfully!");

        const updatedBoards = trashBoards.filter((board) => board.boardId !== boardId);

        setLocalTrashBoards(updatedBoards);
        dispatch(setTrashBoards(updatedBoards));
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Error restoring board. Please try again later.");
    }
  };

  // Permanently delete board handler
  const handlePermanentDelete = async (boardId) => {
    if (!window.confirm("Are you sure you want to permanently delete this board? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/boards/delete/${boardId}`, {
        withCredentials: true,
      });

      const updatedTrashBoards = trashBoards.filter((board) => board.boardId !== boardId);

      setLocalTrashBoards(updatedTrashBoards);
      dispatch(setTrashBoards(updatedTrashBoards));

      alert("Board permanently deleted.");
    } catch (error) {
      console.error("Permanent delete failed:", error);
      alert("Failed to permanently delete board.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Topbar />
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Trash</h1>

          {trashBoards.length === 0 ? (
            <div className="text-gray-600 mb-4 text-center">Trash is empty</div>
          ) : (
            <TrashBoards boards={trashBoards} onRestore={handleRestore} onPermanentDelete={handlePermanentDelete} />
          )}
        </div>
      </div>
    </div>
  );
}
