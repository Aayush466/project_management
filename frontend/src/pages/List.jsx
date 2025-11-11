import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiMoreHorizontal,
  FiAlignLeft,
  FiTrash2,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { BiDetail } from "react-icons/bi";
import { FiPaperclip } from "react-icons/fi";
import { MdOutlineDescription } from "react-icons/md";
import { setTrashCards, setTrashLists } from "../features/profile/profileSlice";

// --- TaskCard Component ---
const TaskCard = ({ card, listId, onOpenTask, onDeleteCard }) => (
  <div
    className="bg-white rounded-md shadow-sm p-2 mb-2 cursor-pointer hover:bg-gray-50 transition flex justify-between items-start group"
    onClick={() => onOpenTask(card, listId)}
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

    <div
      className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => onDeleteCard(listId, card._id, card.title)}
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
      <div className="flex justify-between items-center mb-2 relative">
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          {list.title}
        </h2>
        <div className="relative">
          <button
            className="text-gray-500 hover:text-gray-700 p-1 cursor-pointer"
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
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                Delete List
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
        {(list.cards || []).filter(card => card.trash !== true).map((card) => (
          <TaskCard
            key={card._id || card.title}
            card={card}
            listId={list._id}
            onOpenTask={onOpenTask}
            onDeleteCard={onDeleteCard}
          />
        ))}

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
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm mr-2 cursor-pointer"
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

      {!isAddingTask && (
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-800 py-2 mt-2 transition cursor-pointer"
        >
          <FiPlus className="mr-1" /> Add a card
        </button>
      )}
    </div>
  );
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
  const [selectedDate, setSelectedDate] = useState(task.dueDateTime || ""); // Full ISO string
  const [selectedTime, setSelectedTime] = useState(
    getTimePart(task.dueDateTime)
  ); // Time part only (HH:MM)
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
      if (description !== "") formData.append("description", description);
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
        dueDateTime: selectedDate, // Saved date/time
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

  const formatDescription = (text) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g; // Matches http/https links

    // Replace URLs with <a> tags
    return text.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-4xl transition"
          >
            &times;
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-6 border-b border-gray-100 pb-4">
          <BiDetail className="text-4xl text-blue-600 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 break-words">
              {task.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              in list{" "}
              <span className="text-blue-600 font-medium">{listName}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 ml-9">
          <ActionButton
            icon={FiPaperclip}
            label="Add Attachment"
            onClick={() => document.getElementById("fileInput").click()}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 cursor-pointer"
          />
        </div>

        {/* Description Section */}
        <section className="flex items-start space-x-3 mb-8">
          <MdOutlineDescription className="text-2xl text-blue-500 mt-1" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Description
              </h3>

              {!isEditingDescription && (
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingDescription ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="w-full rounded-md p-3 text-sm border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none resize-none min-h-[100px] bg-gray-50"
              />
            ) : (
              <div
                className="w-full p-3 text-sm text-gray-700 bg-gray-50 rounded-md border border-transparent cursor-pointer hover:border-gray-300 min-h-[60px] transition"
                onClick={() => setIsEditingDescription(true)}
              >
                {description.trim() ? (
                  <div
                    className="whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatDescription(description),
                    }}
                  />
                ) : (
                  <span className="text-gray-400 italic">
                    Click to add a detailed description...
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Due Date Section */}
        <section className="mb-8">
          <label className="block text-lg font-semibold text-gray-800 mb-3">
            Due Date
          </label>

          {!isEditingDate && selectedDate ? (
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium cursor-pointer transition"
              onClick={() => setIsEditingDate(true)}
            >
              <span>{formatDateTime(selectedDate)}</span>
              <FiChevronDown className="w-4 h-4" />
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  id="dateInput"
                  type="date"
                  value={getDatePart(selectedDate)}
                  onChange={handleDatePartChange}
                  className="rounded-md p-2 text-sm border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none"
                />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={handleTimePartChange}
                  className="rounded-md p-2 text-sm border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none"
                />
              </div>

              <div className="flex space-x-3">
                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate("");
                      setIsEditingDate(false);
                    }}
                    className="px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-md text-sm flex items-center space-x-1 transition"
                  >
                    <FiTrash2 className="text-red-500" />
                    <span>Remove</span>
                  </button>
                )}
                <button
                  onClick={() => setIsEditingDate(false)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Attachments Section */}
        <section className="mb-8">
          <label className="block text-lg font-semibold text-gray-800 mb-3">
            Attachments
          </label>

          {selectedFile ? (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-700 font-medium">
                {selectedFile.name}
              </p>

              {selectedFile.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="mt-3 max-h-48 rounded-lg border"
                />
              )}

              <button
                onClick={() => setSelectedFile(null)}
                className="mt-3 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md text-sm flex items-center space-x-1 transition"
              >
                <FiTrash2 className="text-red-500" />
                <span>Remove</span>
              </button>
            </div>
          ) : attachments && attachments.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-3 font-medium">
                Existing Attachment:
              </p>

              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm mb-2"
                >
                  <a
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    {attachment.fileName}
                  </a>

                  <button
                    onClick={() => handleDeleteAttachment(attachment.fileId)}
                    className="text-red-500 hover:text-red-700 flex items-center space-x-1 cursor-pointer transition"
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
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-sm font-medium border border-blue-200 transition"
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
        </section>

        {/* Save / Cancel Buttons */}
        <div className="flex items-center mt-6 space-x-4 border-t border-gray-100 pt-4">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-md transition"
          >
            Save Changes
          </button>

          <button
            onClick={handleCancel}
            className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm transition"
          >
            Cancel
          </button>

          {isSaved && (
            <span className="text-green-600 text-sm font-medium ml-4 flex items-center animate-fadeIn">
              <svg
                className="inline-block w-5 h-5 mr-1 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
    boardData.lists
      ?.filter((list) => list.trash !== true)
      .map((l) => ({ ...l, cards: l.cards || [] })) || []
  );

  const dispatch = useDispatch();
  const globalTrashedLists = useSelector(
    (state) => state.profile?.trashLists || []
  );
  const globalTrashedCards = useSelector(
    (state) => state.profile?.trashCards || []
  );
  const [trashLists, setTrashListsLocal] = useState([]);
  const [trashCards, setTrashCardsLocal] = useState([]);
  const [activeBar, setActiveBar] = useState("default");
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [openAddList, setOpenAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const navigate = useNavigate();

  // Sync trash lists/cards for this board
  useEffect(() => {
    setTrashListsLocal(
      globalTrashedLists.filter((tl) => tl.boardId === boardData._id)
    );
    setTrashCardsLocal(
      globalTrashedCards.filter((tc) => tc.boardId === boardData._id)
    );
  }, [globalTrashedLists, globalTrashedCards, boardData._id]);

  // Add new list
  const handleAddList = async (title) => {
    if (!title.trim()) {
      setOpenAddList(false);
      setNewListName("");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/lists/${boardData._id}`,
        { title },
        { withCredentials: true }
      );
      const createdList = response.data?.data || {
        _id: Date.now().toString(),
        title,
        cards: [],
        trash: false,
      };
      setLists((prev) => [...prev, createdList]);
      setOpenAddList(false);
      setNewListName("");
    } catch (error) {
      console.error("Error adding list", error);
      alert("Failed to add list.");
    }
  };

  // Add card to a list
  const handleAddTask = async (listId, title) => {
    if (!title.trim()) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/cards/${boardData._id}/${listId}`,
        { title },
        { withCredentials: true }
      );
      const createdTask = response.data?.data || {
        _id: Date.now().toString(),
        title,
        trash: false,
      };
      setLists((prevLists) =>
        prevLists.map((list) =>
          list._id === listId
            ? { ...list, cards: [...(list.cards || []), createdTask] }
            : list
        )
      );
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add card.");
    }
  };

  // Soft delete card - move to trash
  const handleDeleteCard = async (listId, cardId, cardTitle) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/cards/${boardData._id}/${listId}/${cardId}`,
        { withCredentials: true }
      );

      setTrashCardsLocal([
        ...trashCards,
        { listId, cardId, boardId: boardData._id, title: cardTitle },
      ]);
      dispatch(
        setTrashCards([
          ...trashCards,
          { listId, cardId, boardId: boardData._id, title: cardTitle },
        ])
      );

      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list._id === listId) {
            return {
              ...list,
              cards: (list.cards || []).map((card) =>
                card._id === cardId ? { ...card, trash: true } : card
              ),
            };
          }
          return list;
        })
      );
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("Failed to delete card.");
    }
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


  // Soft delete list - move to trash
  const handleDeleteList = async (listId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/lists/${boardData._id}/${listId}`,
        { withCredentials: true }
      );
      dispatch(
        setTrashLists([
          ...globalTrashedLists,
          {
            listId,
            boardId: boardData._id,
            title:
              lists.find((list) => list._id === listId)?.title || "Untitled List",
          },
        ])
      );
      setLists((prev) => prev.filter((list) => list._id !== listId));
      alert("List deleted successfully!");
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete list.");
    }
  };

  // Restore list from trash
  const handleRestoreList = async (listId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/lists/restore/${boardData._id}/${listId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("List restored successfully!");

        const updatedTrashLists = trashLists.filter((list) => list.listId !== listId);
        setTrashListsLocal(updatedTrashLists);
        dispatch(setTrashLists(updatedTrashLists));

        const restoredList = boardData.lists.find((list) => list._id === listId);
        if (restoredList) {
          const filteredList = {
            ...restoredList,
            trash: false,
            cards: (restoredList.cards || []).filter(
              (card) => !trashCards.some((trashCard) => trashCard.cardId === card._id)
            ),
          };
          setLists((prevLists) => [
            ...prevLists.filter((list) => list._id !== listId),
            filteredList,
          ]);
        }
      } else {
        alert("Failed to restore list.");
      }
    } catch (error) {
      console.error("Restore list failed:", error);
      alert("Error restoring list.");
    }
  };

  // Restore card from trash
  const handleRestoreCard = async (cardId, listId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/cards/restore/${boardData._id}/${listId}/${cardId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Card restored successfully!");

        const updatedTrashCards = trashCards.filter((card) => card.cardId !== cardId);
        setTrashCardsLocal(updatedTrashCards);
        dispatch(setTrashCards(updatedTrashCards));

        setLists((prevLists) =>
          prevLists.map((list) => {
            if (list._id === listId) {
              return {
                ...list,
                cards: (list.cards || []).map((card) =>
                  card._id === cardId ? { ...card, trash: false } : card
                ),
              };
            }
            return list;
          })
        );
      } else {
        alert("Failed to restore card.");
      }
    } catch (error) {
      console.error("Restore card failed:", error);
      alert("Error restoring card.");
    }
  };

  // Permanently delete list - only possible from trash
  const handlePermanentDeleteList = async (boardId, listId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this list? This action cannot be undone."
      )
    )
      return;
    try {
      await axios.delete(
        `http://localhost:5000/api/lists/delete/${boardId}/${listId}`,
        { withCredentials: true }
      );
      const updatedTrashLists = trashLists.filter((list) => list.listId !== listId);
      setTrashListsLocal(updatedTrashLists);
      dispatch(setTrashLists(updatedTrashLists));
      alert("List permanently deleted.");
    } catch (error) {
      console.error("Permanent delete failed:", error);
      alert("Failed to permanently delete list.");
    }
  };

  // Permanently delete card - only possible from trash
  const handlePermanentDeleteCard = async (boardId, listId, cardId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this card? This action cannot be undone."
      )
    )
      return;
    try {
      await axios.delete(
        `http://localhost:5000/api/cards/delete/${boardId}/${listId}/${cardId}`,
        { withCredentials: true }
      );
      const updatedTrashCards = trashCards.filter((card) => card.cardId !== cardId);
      setTrashCardsLocal(updatedTrashCards);
      dispatch(setTrashCards(updatedTrashCards));
      alert("Card permanently deleted.");
    } catch (error) {
      console.error("Permanent delete failed:", error);
      alert("Failed to permanently delete card.");
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

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center flex-shrink-0">
        <h1 className="text-xl font-bold truncate">{boardData.title}</h1>
        <div>
          <button
            onClick={() => setActiveBar("default")}
            className={`px-4 py-2 rounded ${
              activeBar === "default"
                ? "bg-white text-blue-600"
                : "bg-blue-500"
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setActiveBar("trashes")}
            className={`px-4 py-2 rounded ${
              activeBar === "trashes"
                ? "bg-white text-blue-600"
                : "bg-blue-500"
            } ml-2`}
          >
            Trash
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-blue-600 px-4 py-2 rounded ml-2"
          >
            Back
          </button>
        </div>
      </div>

      {activeBar === "default" && (
        <div className="flex-1 overflow-x-auto p-4 flex space-x-4 items-start bg-[#0079bf]">
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
          <div className="w-72 flex-shrink-0">
            {!openAddList ? (
              <button
                onClick={() => setOpenAddList(true)}
                className="w-full bg-black bg-opacity-10 hover:bg-opacity-20 rounded-lg p-3 h-12 flex items-center text-white text-sm transition cursor-pointer"
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
      )}

      {activeBar === "trashes" && (
        <div className="p-4 bg-[#0079bf] flex flex-col flex-grow overflow-y-auto space-y-4">
          <button
            onClick={() => setActiveBar("default")}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-100 self-end"
          >
            Back to Board
          </button>

          {(trashLists.length === 0 && trashCards.length === 0) && (
            <h3 className="text-white">Trash is empty</h3>
          )}

          <div className="flex flex-wrap gap-6">
            {trashLists.map((trashList, idx) => (
              <div
                key={idx}
                className="bg-white rounded-md overflow-hidden w-64 flex flex-col"
              >
                <div className="text-red-600 bg-gray-200 px-2 py-1 flex justify-between items-center">
                  <h4>List</h4>
                  <button
                    onClick={() => handleRestoreList(trashList.listId)}
                    className="p-1 rounded-full cursor-pointer"
                    title="Restore list"
                  >
                    <ArchiveRestore className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePermanentDeleteList(boardData._id, trashList.listId)}
                    className="p-1 rounded-full cursor-pointer text-red-600 hover:text-red-800"
                    title="Permanently delete list"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-2 py-1">
                  <div className="flex gap-2">
                    <span>Id:</span>{" "}
                    <span className="text-gray-600">{trashList.listId}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Title:</span>{" "}
                    <span className="text-gray-600">{trashList.title}</span>
                  </div>
                </div>
              </div>
            ))}

            {trashCards.map((trashCard, idx) => (
              <div
                key={idx}
                className="bg-white rounded-md overflow-hidden w-64 flex flex-col"
              >
                <div className="text-red-600 bg-gray-200 px-2 py-1 flex justify-between items-center">
                  <h4>Card</h4>
                  <button
                    onClick={() => handleRestoreCard(trashCard.cardId, trashCard.listId)}
                    className="p-1 rounded-full cursor-pointer"
                    title="Restore card"
                  >
                    <ArchiveRestore className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePermanentDeleteCard(boardData._id, trashCard.listId, trashCard.cardId)}
                    className="p-1 rounded-full cursor-pointer text-red-600 hover:text-red-800"
                    title="Permanently delete card"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-2 py-1">
                  <div className="flex gap-2">
                    <span>Id:</span>{" "}
                    <span className="text-gray-600">{trashCard.cardId}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Title:</span>{" "}
                    <span className="text-gray-600">{trashCard.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
