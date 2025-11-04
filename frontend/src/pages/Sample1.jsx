import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiMoreHorizontal,
  FiAlignLeft,
  FiTrash2,
  FiTag,
  FiClock,
  FiPaperclip,
  FiChevronDown,
} from "react-icons/fi";
import { BiDetail } from "react-icons/bi";
import { MdOutlineDescription } from "react-icons/md";

// --- TaskCard Component ---
const TaskCard = ({ card, listId, onOpenTask, onDeleteCard }) => (
  <div
    className="bg-white rounded-md shadow-sm p-2 mb-2 cursor-pointer hover:bg-gray-50 transition flex justify-between items-start group"
    onClick={() => onOpenTask(card, listId)} // ✅ Whole card clickable
  >
    <div>
      <p className="text-sm text-gray-800 break-words">{card.title}</p>
      {card.attachment && (
        <div className="mt-1">
          <a
            href={`http://localhost:5000/uploads/${card.attachment}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline"
          >
            📎 {card.attachment}
          </a>
        </div>
      )}
    </div>

    {/* Hover actions */}
    <div
      className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={(e) => e.stopPropagation()} // ✅ Prevent modal open when deleting
    >
      <button
        onClick={() => onDeleteCard(listId, card._id)}
        className="text-red-500 hover:text-red-700"
      >
        <FiTrash2 />
      </button>
      <FiAlignLeft className="text-gray-400" />
    </div>
  </div>
);

// --- KanbanList Component ---
const KanbanList = ({
  list,
  onAddTask,
  onDeleteList,
  onOpenTask,
  onDeleteCard,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [openMenuListId, setOpenMenuListId] = useState(null);

  const handleAddTaskSubmit = () => {
    if (newTaskTitle.trim() === "") {
      setIsAddingTask(false);
      return;
    }
    onAddTask(list._id, newTaskTitle);
    setNewTaskTitle("");
    setIsAddingTask(false);
  };

  return (
    <div className="relative w-72 flex-shrink-0 bg-gray-100 bg-opacity-90 rounded-lg shadow p-3 max-h-[calc(100vh-8rem)] flex flex-col">
      {/* List Header */}
      <div className="flex justify-between items-center mb-2 relative">
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          {list.title}
        </h2>
        <div className="relative">
          <button
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() =>
              setOpenMenuListId(openMenuListId === list._id ? null : list._id)
            }
          >
            <FiMoreHorizontal />
          </button>
          {openMenuListId === list._id && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10">
              <button
                onClick={() => onDeleteList(list._id)}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
              >
                Delete List
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
        {(list.cards || []).map((card) => (
          <TaskCard
            key={card._id || card.title}
            card={card}
            listId={list._id}
            onOpenTask={onOpenTask}
            onDeleteCard={onDeleteCard}
          />
        ))}

        {/* Add Card Form */}
        {isAddingTask && (
          <div className="mb-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onBlur={handleAddTaskSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTaskSubmit();
                else if (e.key === "Escape") setIsAddingTask(false);
              }}
              placeholder="Enter a title for this card..."
              className="w-full rounded-md p-2 text-sm border-blue-500 focus:ring-blue-500 outline-none shadow-sm"
              autoFocus
            />
            <div className="flex items-center mt-2">
              <button
                onClick={handleAddTaskSubmit}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm mr-2"
              >
                Add card
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &#x2715;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Card Button */}
      {!isAddingTask && (
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-800 py-2 mt-2 transition"
        >
          <FiPlus className="mr-1" /> Add a card
        </button>
      )}
    </div>
  );
};

// --- TaskDetailModal Component (with working attachments) ---
const formatDateTime = (isoString) => {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    // Format: Nov 19, 11:00 AM
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return isoString;
  }
};

// --- Helper function to get the YYYY-MM-DD date part ---
const getDatePart = (isoString) =>
  isoString ? isoString.substring(0, 10) : "";

// --- Helper function to get the HH:MM (24-hour) time part ---
const getTimePart = (isoString) => {
  if (!isoString) return "09:00"; // Default time
  try {
    const date = new Date(isoString);
    // Ensure consistent time zone handling if needed, but for local input, this works:
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (e) {
    return "09:00";
  }
};

const TaskDetailModal = ({
  task,
  listName,
  boardId,
  listId,
  onClose,
  onUpdateTask,
}) => {
  const [description, setDescription] = useState(task.description || "");
  const [selectedDate, setSelectedDate] = useState(task.dueDateTime || "");
  const [selectedTime, setSelectedTime] = useState(
    getTimePart(task.dueDateTime)
  ); // Time part only (HH:MM)

  const [selectedFile, setSelectedFile] = useState(null);
  const [attachments, setAttachments] = useState(
    task.attachments && task.attachments.length > 0 ? task.attachments : [] 
  );
  const [isSaved , setIsSaved] = useState(false);

  const [isEditingDescription , setIsEditingDescription ] = useState(false);
  const [isEditingDate , setIsEditingDate] = useState(false);


  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSave = async () =>{
    try {
        const formData = new FormData();
        
    } catch (error) {
        
    }
  }
 };

// --- BoardView Component ---
const BoardView = ({ boardData, onBackToDashboard }) => {
  const [lists, setLists] = useState(
    boardData.lists?.map((l) => ({ ...l, cards: l.cards || [] })) || []
  );
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [openAddList, setOpenAddList] = useState(false);
  const [newListName, setNewListName] = useState("");

  // --- Add Card ---
  const handleAddTask = async (listId, title) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/cards/${boardData._id}/${listId}`,
        { title },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const createdTask = {
        ...(response.data || {}),
        _id: response.data.data?._id || Date.now().toString(),
        title: response.data?.title || title,
      };

      setLists((prev) =>
        prev.map((list) =>
          list._id === listId
            ? { ...list, cards: [...(list.cards || []), createdTask] }
            : list
        )
      );
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add card. Check console for details.");
    }
  };

  // --- Delete Card ---
  const handleDeleteCard = async (listId, cardId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/cards/${boardData._id}/${listId}/${cardId}`,
        { withCredentials: true }
      );

      setLists((prev) =>
        prev.map((list) =>
          list._id === listId
            ? {
                ...list,
                cards: list.cards.filter((card) => card._id !== cardId),
              }
            : list
        )
      );
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("Failed to delete card. Check console for details.");
    }
  };

  // --- Add List ---
  const handleAddList = async (title) => {
    setOpenAddList(false);
    if (!title) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/lists/${boardData._id}`,
        { title },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const createdList = {
        ...(response.data || {}),
        _id: response.data.data?._id || Date.now().toString(),
        title: response.data?.title || title,
        cards: response.data?.cards || [],
      };

      setLists((prevLists) => [...prevLists, createdList]);
      setNewListName("");
    } catch (error) {
      console.error("Error adding list:", error);
      alert("Failed to add list. Check console for details.");
    }
  };

  // --- Delete List ---
  const handleDeleteList = async (listId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/lists/${boardData._id}/${listId}`,
        { withCredentials: true }
      );
      setLists((prev) => prev.filter((list) => list._id !== listId));
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete list. Check console for details.");
    }
  };

  // --- Open Task Modal ---
  const handleOpenTask = (card, listId) => {
    const fetchTaskData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cards/${boardData._id}/${listId}/${card._id}`,
          { withCredentials: true }
        );

        if (response.data?.data) {
          const list = lists.find((l) => l._id === listId);
          console.log(response.data.data);
          if (list) {
            setSelectedTaskDetails({
              task: response.data.data,
              listName: list.title,
              listId,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTaskData();
  };

  const handleCloseTask = () => setSelectedTaskDetails(null);

  // --- Update Task After Save ---
  const handleUpdateTask = (updatedTask) => {
    setLists((prev) =>
      prev.map((list) =>
        list._id === updatedTask.listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card._id === updatedTask._id ? updatedTask : card
              ),
            }
          : list
      )
    );
  };

  const boardTitle = boardData.title;
  const boardBg = "bg-blue-600";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div
        className={`p-4 ${boardBg} text-white flex justify-between items-center flex-shrink-0`}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToDashboard}
            className="px-2 py-1 hover:bg-white hover:bg-opacity-20 rounded transition"
          >
            <FiAlignLeft className="inline-block mr-1" /> Boards
          </button>
          <h1 className="text-xl font-bold truncate">{boardTitle}</h1>
        </div>
      </div>

      {/* Kanban Board */}
      <div
        className="flex-1 overflow-x-auto p-4 flex space-x-4 items-start"
        style={{ backgroundColor: "#0079bf" }}
      >
        {lists.map((list) => (
          <KanbanList
            key={list._id}
            list={list}
            onAddTask={handleAddTask}
            onDeleteList={handleDeleteList}
            onOpenTask={handleOpenTask}
            onDeleteCard={handleDeleteCard}
          />
        ))}

        {/* Add New List */}
        <div className="w-72 flex-shrink-0">
          {!openAddList ? (
            <button
              onClick={() => setOpenAddList(true)}
              className="w-full bg-black bg-opacity-10 hover:bg-opacity-20 rounded-lg p-3 h-12 flex items-center text-white text-sm transition"
            >
              <FiPlus className="mr-1" /> Add another list
            </button>
          ) : (
            <div className="bg-gray-200 rounded-lg p-3 shadow-md">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onBlur={() => handleAddList(newListName)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddList(newListName);
                  else if (e.key === "Escape") setOpenAddList(false);
                }}
                placeholder="Enter list title..."
                className="w-full rounded-md p-2 text-sm border-blue-500 focus:ring-blue-500 outline-none shadow-sm"
                autoFocus
              />
              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleAddList(newListName)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm mr-2"
                >
                  Add list
                </button>
                <button
                  onClick={() => setOpenAddList(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  &#x2715;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {selectedTaskDetails && (
        <TaskDetailModal
          task={selectedTaskDetails.task}
          listName={selectedTaskDetails.listName}
          boardId={boardData._id}
          listId={selectedTaskDetails.listId}
          onClose={handleCloseTask}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default BoardView;
