import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useSelector, useDispatch } from "react-redux";
import { setBoards, setTrashBoards } from "../features/profile/profileSlice";
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
      staggerChildren: 0.07, // Stagger items
    },
  },
};

const listItemVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  // Animation for when an item is removed (restored/deleted)
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

// --- START: TrashBoards (Animated Component) ---
const TrashBoards = ({ boards, onRestore, onPermanentDelete }) => {
  return (
    <motion.div // 👈 Apply container variant for staggered entrance
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 bg-white rounded-xl ring-1 ring-gray-100 border border-gray-200"
      variants={listContainerVariants}
      initial="initial"
      animate="visible"
    >
        <AnimatePresence>
      {boards &&
        boards.length > 0 &&
        boards.map((board, index) => (
          <motion.div // 👈 Apply item variant for each board tile
            key={board._id || index} 
            variants={listItemVariants}
            initial="initial"
            animate="animate"
            exit="exit" // Use the exit variant for removal
            // Apply interaction animations
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full h-36 bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-red-500 transition-all duration-300"
          >
            {/* Restore Icon */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onRestore(board._id);
              }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center bg-white text-green-600 rounded-full p-1.5 shadow-md hover:bg-green-50 transition-all duration-300 z-10"
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
            </motion.button>

            {/* Permanent Delete Icon */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onPermanentDelete(board._id);
              }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center bg-white text-red-500 rounded-full p-1.5 shadow-md hover:bg-red-50 transition-all duration-300 z-10"
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
            </motion.button>

            {/* Accent Header Section */}
            <div className="h-3/5 bg-red-500/10 p-3 flex items-center">
                <span className="text-xs font-medium text-red-500">DELETED</span>
            </div>

            {/* White Footer Section with Board Name */}
            <div className="h-2/5 p-4 flex flex-col justify-end">
              <span className="text-gray-800 font-semibold text-lg truncate">
                {board.title || "Untitled Board"}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                 {board.deletedAt ? `Deleted: ${new Date(board.deletedAt).toLocaleDateString()}` : ''}
              </span>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
    </motion.div>
  );
};
// --- END: TrashBoards ---

export default function Trash() {
  const [openSideBar,setOpenSideBar] = useState(false);
  const dispatch = useDispatch();
  const globalBoards = useSelector((state) => state.profile.boards);
  const globalTrashBoards = useSelector((state) => state.profile.trashBoards);

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
        // No alert needed, visual transition is enough
        const restoredBoard = trashBoards.filter((board) => board._id === boardId)[0];
        dispatch(setBoards([...globalBoards, restoredBoard]))
        dispatch(setTrashBoards(trashBoards.filter(board=>board._id!==boardId)));
        // Local state update triggers exit animation in TrashBoards component
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

      // Dispatch and local state update trigger exit animation
      dispatch(setTrashBoards(trashBoards.filter(board=>board._id!==boardId)));
      // No alert needed, visual transition is enough
    } catch (error) {
      console.error("Permanent delete failed:", error);
      alert("Failed to permanently delete board.");
    }
  };

  // --- Main Render ---
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={openSideBar} onClose={setOpenSideBar} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Topbar handleOpenSideBar={setOpenSideBar} />
        
        <motion.div // 👈 Apply main content entrance
          variants={mainContentVariants}
          initial="hidden"
          animate="visible"
          className="p-4 md:p-8 w-full max-w-7xl mx-auto"
        >
          
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8 pb-2 border-b border-gray-200">
            <span role="img" aria-label="trash-icon" className="mr-2">🗑️</span> Trash Bin
          </h1>

          {/* Use AnimatePresence for the conditional rendering of the list vs empty state */}
          <AnimatePresence mode="wait">
            {trashBoards.length === 0 ? (
              // Attractive Empty State with animation
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-12 rounded-xl text-center border border-gray-200"
              >
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-1">Trash is Empty</h3>
                <p className="text-gray-500">Deleted items will appear here and can be restored.</p>
              </motion.div>
            ) : (
              // Render TrashBoards with the new styling and exit animation
              <TrashBoards 
                key="list"
                boards={trashBoards} 
                onRestore={handleRestore} 
                onPermanentDelete={handlePermanentDelete} 
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};