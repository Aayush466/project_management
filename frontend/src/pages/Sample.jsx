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
  const [selectedDate, setSelectedDate] = useState(task.dueDate || ""); // Full ISO string
  const [selectedTime, setSelectedTime] = useState(getTimePart(task.dueDate)); // Time part only (HH:MM)
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachments, setAttachments] = useState(
    task.attachments && task.attachments.length > 0 ? task.attachments : []
  );
  const [isSaved, setIsSaved] = useState(false);

  // States for Edit Modes
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  // Sync selectedTime when selectedDate changes externally (e.g., initial load)
  useEffect(() => {
    if (selectedDate) {
      setSelectedTime(getTimePart(selectedDate));
    } else {
      setSelectedTime("09:00");
    }
  }, [selectedDate]);

  const ActionButton = ({ icon: Icon, label, onClick }) => (
    <button
      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-sm text-gray-700 transition"
      onClick={onClick}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </button>
  );

  // --- Date/Time Handlers ---

  const handleDatePartChange = (e) => {
    const newDatePart = e.target.value; // YYYY-MM-DD
    if (newDatePart) {
      // Combine the new date part with the current time part
      const combinedDateTime = `${newDatePart}T${selectedTime || "09:00"}:00`;
      // Convert to ISO string for backend
      setSelectedDate(new Date(combinedDateTime).toISOString());
    } else {
      setSelectedDate("");
    }
  };

  const handleTimePartChange = (e) => {
    const newTimePart = e.target.value; // HH:MM
    setSelectedTime(newTimePart);

    // Re-combine with the existing date part
    if (selectedDate) {
      const datePart = getDatePart(selectedDate);
      const combinedDateTime = `${datePart}T${newTimePart}:00`;
      setSelectedDate(new Date(combinedDateTime).toISOString());
    }
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  // --- SAVE UPDATED TASK DETAILS ---
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("description", description);
      // Send the combined ISO date/time string
      formData.append("dueDateTime", selectedDate);
      if (selectedFile) {
        formData.append("files", selectedFile);
      }

      const response = await axios.put(
        `http://localhost:5000/api/cards/${boardId}/${listId}/${task._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setAttachments(() => response.data.data.attachments);

      const updatedTask = response.data?.data || {
        ...task,
        description,
        dueDate: selectedDate, // Saved date/time
        attachment: selectedFile ? selectedFile.name : task.attachment,
        listId,
      };

      onUpdateTask(updatedTask);
      setSelectedFile(null);
      task.files = updatedTask.files;

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);

      // Exit all edit modes on successful save
      setIsEditingDescription(false);
      setIsEditingDate(false);
    } catch (error) {
      console.error("Error saving task details:", error);
      alert("Failed to save task details. Check console for details.");
    }
  };

  const handleCancel = () => {
    // Reset local state to original task values
    setDescription(task.description || "");
    setSelectedDate(task.dueDate || "");
    setSelectedFile(null);

    // Exit all edit modes
    setIsEditingDescription(false);
    setIsEditingDate(false);
    onClose();
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this attachment?"))
        return;

      await axios.delete(
        `http://localhost:5000/api/cards/${boardId}/${listId}/${
          task._id
        }/${attachmentId.split("/").pop()}`,
        { withCredentials: true }
      );

      setAttachments(attachments.filter((att) => att.fileId !== attachmentId));

      alert("Attachment deleted successfully!");
    } catch (error) {
      console.error("Error deleting attachment:", error);
      alert("Failed to delete attachment.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &#x2715;
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-4">
          <BiDetail className="text-3xl text-gray-600 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 break-words">
              {task.title}
            </h2>
            <p className="text-sm text-gray-500">
              in list <span className="underline">{listName}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-2 ml-9">
          <ActionButton
            icon={FiPaperclip}
            label="Attachment"
            onClick={() => document.getElementById("fileInput").click()}
          />
          <ActionButton
            icon={FiClock}
            label="Dates"
            // Toggle Date Edit Mode
            onClick={() => setIsEditingDate(true)}
          />
        </div>

        {/* --- DESCRIPTION SECTION (Edit/View Mode) --- */}
        <div className="flex items-start space-x-3 mb-6">
          <MdOutlineDescription className="text-2xl text-gray-600 mt-1" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Description
              </h3>

              {/* Edit Button */}
              {!isEditingDescription && (
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Conditional Rendering for Edit/View */}
            {isEditingDescription ? (
              // --- EDIT MODE: Rich Text Mockup/Textarea ---
              <div className="w-full border border-blue-400 rounded-md shadow-sm">
                {/* RICH TEXT EDITOR TOOLBAR MOCKUP */}
                {/* <div className="flex items-center p-1.5 bg-gray-50 border-b border-gray-200 rounded-t-md">
                  <button className="px-3 py-1 bg-gray-200 rounded-md text-sm text-gray-800 flex items-center hover:bg-gray-300">
                    Aa
                    <FiChevronDown className="ml-1 w-3 h-3" />
                  </button>
                  <span className="text-gray-300 mx-2">|</span>
                  <button className="px-2 py-1 font-bold text-gray-800 hover:bg-gray-200 rounded-md">
                    B
                  </button>
                  <button className="px-2 py-1 italic text-gray-800 hover:bg-gray-200 rounded-md">
                    I
                  </button>
                  <span className="text-gray-300 mx-2">|</span>
                  
                </div> */}

                {/* Text Area Content */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a detailed description..."
                  className="w-full p-2 text-sm text-gray-900 outline-none resize-none min-h-[100px] rounded-b-md"
                  // Note: Removed the border class from textarea itself as the container now handles it
                />
              </div>
            ) : (
              // --- VIEW MODE: Read-only display ---
              <div
                className="w-full p-2 text-sm text-gray-700 bg-gray-50 rounded-md border border-transparent cursor-pointer hover:border-gray-300 min-h-[50px]"
                onClick={() => setIsEditingDescription(true)}
              >
                {description.trim() ? (
                  <div className="whitespace-pre-wrap">{description}</div>
                ) : (
                  <span className="text-gray-400 italic">
                    Click to add a detailed description...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {/* ------------------------------------------- */}

        {/* --- DUE DATE SECTION (Edit/View Mode) --- */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            Due Date
          </label>

          {/* VIEW MODE */}
          {!isEditingDate && selectedDate ? (
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium cursor-pointer transition"
              onClick={() => setIsEditingDate(true)}
            >
              <span className="text-blue-600">
                {formatDateTime(selectedDate)}
              </span>
              <FiChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          ) : (
            // EDIT MODE (visible if editing or if selectedDate is empty)
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                {/* Date Input */}
                <input
                  id="dateInput"
                  type="date"
                  value={getDatePart(selectedDate)}
                  onChange={handleDatePartChange}
                  className="rounded-md p-2 text-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500 outline-none"
                />
                {/* Time Input */}
                <input
                  type="time"
                  value={selectedTime}
                  onChange={handleTimePartChange}
                  className="rounded-md p-2 text-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-start space-x-2 mt-3">
                {/* Remove Due Date Button */}
                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate("");
                      setIsEditingDate(false);
                    }}
                    className="px-3 py-1 bg-white border border-red-300 hover:bg-red-50 text-red-600 rounded-md text-sm flex items-center space-x-1"
                  >
                    <FiTrash2 className="text-red-500" />
                    <span>Remove Due Date</span>
                  </button>
                )}
                {/* Done Button */}
                <button
                  onClick={() => setIsEditingDate(false)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
        {/* ------------------------------------------- */}

        {/* File Attachment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Attachment
          </label>

          {selectedFile ? (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700">{selectedFile.name}</p>

              {selectedFile.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="mt-2 max-h-40 rounded-md border"
                />
              )}

              <button
                onClick={() => setSelectedFile(null)}
                className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm flex items-center space-x-1"
              >
                <FiTrash2 className="text-red-500" />
                <span>Remove</span>
              </button>
            </div>
          ) : attachments && attachments.length > 0 ? (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">Existing Attachment:</p>

              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm mb-2"
                >
                  <a
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {attachment.fileName}
                  </a>

                  <button
                    onClick={() => handleDeleteAttachment(attachment.fileId)}
                    className="text-red-500 hover:text-red-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <FiTrash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="flex items-center space-x-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-sm text-gray-700 transition"
            >
              <FiPaperclip className="text-lg" />
              <span>Attach a file</span>
            </button>
          )}

          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Save / Cancel with Improvements */}
        <div className="flex items-center mt-4 space-x-3">
          {/* Save Button - Primary Action */}
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-md hover:shadow-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            Save Changes
          </button>

          {/* Cancel Button - Secondary Action/Outline Style */}
          <button
            onClick={handleCancel}
            className="px-5 py-2 text-gray-700 font-semibold bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
          >
            Cancel
          </button>

          {isSaved && (
            <span className="text-green-500 text-sm font-medium ml-4 animate-pulse">
              <svg
                className="inline-block w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
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
