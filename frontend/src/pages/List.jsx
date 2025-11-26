import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiMoreHorizontal,
  FiAlignLeft,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { FiLayout } from "react-icons/fi";
import { FiArrowLeft,FiArchive,FiCreditCard,FiList } from "react-icons/fi";
import { ArchiveRestore } from "lucide-react";
import { BiDetail } from "react-icons/bi";
import { FiPaperclip } from "react-icons/fi";
import { MdOutlineDescription } from "react-icons/md";

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

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

// --- TaskCard Component ---
const TaskCard = ({ card, listId, onOpenTask, onDeleteCard }) => (
  <div
    className="bg-white rounded-lg shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition duration-200 border border-gray-200 hover:bg-gray-50"
    onClick={() => onOpenTask(card, listId)}
  >
    <div className="flex justify-between items-start group">
      <p className="text-sm font-medium text-gray-800 break-words flex-grow pr-2">{card.title}</p>

      {/* Action buttons visible on hover, positioned to the right */}
      <div
        className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onDeleteCard(listId, card._id, card.title)}
          className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition"
          title="Delete Card"
        >
          <FiTrash2 size={16} />
        </button>
        <FiAlignLeft className="text-gray-400" size={16} />
      </div>
    </div>

    {card.attachment && (
      <div className="mt-2">
        <a
          href={`http://localhost:5000/uploads/${card.attachment}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 underline hover:text-blue-800 flex items-center"
        >
          <FiPaperclip size={12} className="mr-1" /> {card.attachment}
        </a>
      </div>
    )}
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
    <div className="relative w-full flex-shrink-0 bg-gray-100/90 rounded-xl shadow-lg p-3  flex flex-col transition-shadow hover:shadow-xl">
      <div className="flex justify-between items-center mb-3 relative">
        <h2 className="text-sm font-bold text-gray-800 truncate uppercase tracking-wide">
          {list.title} ({list.cards?.filter(card => card.trash !== true).length || 0})
        </h2>
        <div className="relative">
          <button
            className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 transition"
            onClick={() =>
              setOpenMenuListId(openMenuListId === list._id ? null : list._id)
            }
            title="List options"
          >
            <FiMoreHorizontal />
          </button>
          {openMenuListId === list._id && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1">
              <button
                onClick={() => {
                  onDeleteList(list._id);
                  setOpenMenuListId(null);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer flex items-center"
              >
                <FiTrash2 size={14} className="mr-2" /> Delete List
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow  pr-1 space-y-2">
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
          <div className="mb-2 p-2 bg-white rounded-lg shadow-inner border border-blue-200">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onBlur={handleAddTaskSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTaskSubmit();
                else if (e.key === "Escape") {
                  setNewTaskTitle("");
                  setIsAddingTask(false);
                }
              }}
              placeholder="Enter a title for this card..."
              className="w-full rounded-md p-2 text-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500 outline-none shadow-sm"
              autoFocus
            />
            <div className="flex items-center mt-2">
              <button
                onClick={handleAddTaskSubmit}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm mr-2 transition shadow"
              >
                Add card
              </button>
              <button
                onClick={() => {
                    setNewTaskTitle("");
                    setIsAddingTask(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl p-1 rounded-full hover:bg-gray-200 transition"
                title="Cancel"
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
          className="flex items-center text-sm text-gray-600 hover:text-blue-700 hover:bg-gray-200 py-2 px-3 mt-2 rounded-lg transition cursor-pointer"
        >
          <FiPlus className="mr-1 text-lg" /> Add a card
        </button>
      )}
    </div>
  );
};

// --- TaskDetailModal Component ---
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
      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 font-medium transition shadow-sm"
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100 transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-3xl transition p-1 -mt-2 -mr-2 rounded-full hover:bg-gray-100"
            title="Close"
          >
            &times;
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start space-x-4 mb-6 border-b border-gray-100 pb-4">
          <BiDetail className="text-4xl text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-extrabold text-gray-900 break-words truncate">
              {task.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              in list <span className="text-blue-600 font-semibold">{listName}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 ml-0 pl-10 -mt-4">
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <ActionButton
            icon={FiPaperclip}
            label="Add Attachment"
            onClick={() => document.getElementById("fileInput").click()}
          />
        </div>

        {/* Description Section */}
        <section className="flex items-start space-x-4 mb-8">
          <MdOutlineDescription className="text-2xl text-gray-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-800">
                Description
              </h3>

              {!isEditingDescription && (
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingDescription ? (
              <>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="w-full rounded-lg p-3 text-sm border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-y min-h-[120px] bg-white shadow-inner"
                />
                <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={() => setIsEditingDescription(false)} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={handleSave} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow">Save</button>
                </div>
              </>
            ) : (
              <div
                className="w-full p-3 text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 min-h-[60px] transition shadow-inner"
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
          <div className="flex items-center mb-3">
            <label className="text-lg font-bold text-gray-800 mr-4">
              Due Date
            </label>

            {!isEditingDate && selectedDate ? (
              <div
                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-200 transition shadow-sm"
                onClick={() => setIsEditingDate(true)}
              >
                <FiCalendar className="w-4 h-4" />
                <span>{formatDateTime(selectedDate)}</span>
                <FiChevronDown className="w-4 h-4 ml-1" />
              </div>
            ) : (
                 <span className="text-sm text-gray-500 italic">
                    {isEditingDate ? "Set a due date" : "No due date set"}
                </span>
            )}
          </div>

          {(isEditingDate || !selectedDate) && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-md">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  id="dateInput"
                  type="date"
                  value={getDatePart(selectedDate)}
                  onChange={handleDatePartChange}
                  className="rounded-lg p-2 text-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
                />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={handleTimePartChange}
                  className="rounded-lg p-2 text-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
                />
              </div>

              <div className="flex space-x-3">
                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate("");
                      setSelectedTime("09:00");
                      setIsEditingDate(false); // Will trigger save logic on next save
                    }}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
                  >
                    <FiTrash2 size={14} />
                    <span>Remove Date</span>
                  </button>
                )}
                <button
                  onClick={() => setIsEditingDate(false)}
                  className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Attachments Section */}
        <section className="mb-8">
          <label className="block text-lg font-bold text-gray-800 mb-3">
            Attachments
          </label>

          {selectedFile ? (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-md">
              <p className="text-sm text-gray-800 font-medium truncate mb-2">
                New File: {selectedFile.name}
              </p>

              {selectedFile.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="mt-2 max-h-40 w-auto rounded-lg border border-gray-300 object-cover"
                />
              )}

              <button
                onClick={() => setSelectedFile(null)}
                className="mt-3 flex items-center space-x-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition"
              >
                <FiTrash2 size={14} />
                <span>Remove Upload</span>
              </button>
            </div>
          ) : attachments && attachments.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
              <p className="text-sm text-gray-600 mb-3 font-semibold">
                Existing Files:
              </p>

              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm mb-2 p-2 bg-white rounded-lg border"
                >
                  <a
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium truncate flex items-center"
                  >
                    <FiPaperclip size={14} className="mr-2 flex-shrink-0" />
                    {attachment.fileName}
                  </a>

                  <button
                    onClick={() => handleDeleteAttachment(attachment.fileId)}
                    className="text-red-500 hover:text-red-700 flex items-center space-x-1 cursor-pointer transition p-1 rounded hover:bg-red-50"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium border border-blue-200 transition shadow-sm"
            >
              <FiPaperclip className="text-lg" />
              <span>Attach a file</span>
            </button>
          )}
        </section>

        {/* Save / Cancel Buttons */}
        <div className="flex items-center mt-6 space-x-3 border-t border-gray-100 pt-4">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm shadow-lg transition transform hover:scale-[1.01]"
          >
            Save Changes
          </button>

          <button
            onClick={handleCancel}
            className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm shadow-md transition"
          >
            Close / Discard
          </button>

          {isSaved && (
            <span className="text-green-600 text-sm font-medium ml-4 flex items-center animate-fadeIn bg-green-50 px-3 py-2 rounded-full shadow-md">
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
const BoardView = ({ boardData,setSelectedBoard }) => {
  const [lists, setLists] = useState(
    boardData.lists
      ?.filter((list) => list.trash !== true)
      .map((l) => ({ ...l, cards: l.cards || [] })) || []
  );

  const [trashLists, setTrashListsLocal] = useState(boardData.trashLists);
  const [trashCards, setTrashCardsLocal] = useState(boardData.trashCards);
  const [activeBar, setActiveBar] = useState("default");
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [openAddList, setOpenAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const navigate = useNavigate();

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
      const createdList = response.data.data;
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
      const createdTask = response.data.data;
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
        { list:listId, _id:cardId, title: cardTitle,trash:false },
      ]);

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
      const response = await axios.delete(
        `http://localhost:5000/api/lists/${boardData._id}/${listId}`,
        { withCredentials: true }
      );
        setTrashListsLocal([
          ...trashLists,
          {_id:response.data.data._id,title:response.data.data.title},
        ])
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

        const updatedTrashLists = trashLists.filter((list) => list._id !== listId);
        setTrashListsLocal(updatedTrashLists);

        const restoredList = res.data.data;
        if (restoredList) {
          const filteredList = {
            ...restoredList,
            cards: (restoredList.cards || []).filter(
              (card) => !trashCards.some((trashCard) => trashCard === card._id)
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
  const handleRestoreCard = async (listId,cardId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/cards/restore/${boardData._id}/${listId}/${cardId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Card restored successfully!");

        const updatedTrashCards = trashCards.filter((card) => card._id !== cardId);
        setTrashCardsLocal(updatedTrashCards);

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
      const updatedTrashLists = trashLists.filter((list) => list._id !== listId);
      setTrashListsLocal(updatedTrashLists);
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
      const updatedTrashCards = trashCards.filter((card) => card._id !== cardId);
      setTrashCardsLocal(updatedTrashCards);
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
      <div className="p-4 bg-blue-700 text-white flex justify-between items-center flex-shrink-0 shadow-lg">
        <h1 className="text-xl font-extrabold truncate">{boardData.title}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveBar("default")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              activeBar === "default"
                ? "bg-white text-blue-700 shadow"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            <FiLayout className="inline mr-1" /> Board View
          </button>
          <button
            onClick={() => setActiveBar("trashes")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center ${
              activeBar === "trashes"
                ? "bg-white text-blue-700 shadow"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            <FiTrash2 className="mr-1" /> Trash ({trashLists.length + trashCards.length})
          </button>
          <button
            onClick={() => {
              setSelectedBoard(null)
            }}
            className="bg-white text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition shadow"
          >
            <FiArrowLeft className="inline mr-1" /> Back
          </button>
        </div>
      </div>

      {activeBar === "default" && (
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 h-full overflow-y-auto">
                  <div className="p-5 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 items-start">
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
                className="w-full bg-black/15 hover:bg-black/25 rounded-xl p-3 h-12 flex items-center text-white text-sm font-semibold transition duration-200 shadow-md hover:shadow-lg"
              >
                <FiPlus className="mr-1 text-lg" /> Add another list
              </button>
            ) : (
              <div className="bg-white rounded-xl p-3 shadow-2xl border border-gray-200">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList(newListName);
                    else if (e.key === "Escape") {
                        setNewListName("");
                        setOpenAddList(false);
                    }
                  }}
                  placeholder="Enter list title..."
                  className="w-full rounded-lg p-2 text-sm border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-inner"
                  autoFocus
                />
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleAddList(newListName)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold mr-2 transition shadow"
                  >
                    Add list
                  </button>
                  <button
                    onClick={() => {
                        setNewListName("");
                        setOpenAddList(false);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-xl p-1 rounded-full hover:bg-gray-200 transition"
                    title="Cancel"
                  >
                    &#x2715;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>

      )}

      {activeBar === "trashes" && (
        <div className="p-6 bg-gray-50 flex flex-col flex-grow overflow-y-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Trash Bin
          </h2>

          {(trashLists.length === 0 && trashCards.length === 0) && (
            <div className="text-center p-10 bg-white rounded-xl">
                <FiArchive className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-600">Trash is Empty</h3>
                <p className="text-gray-500">Deleted lists and cards will appear here.</p>
            </div>
          )}

          {trashLists.length > 0 && (
            <div className="space-y-3">
                <h3 className='text-xl font-bold text-red-700'>Deleted Lists ({trashLists.length})</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {trashLists.map((trashList, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl overflow-hidden w-full flex flex-col shadow-lg border border-red-200 transition hover:shadow-xl"
                    >
                        <div className="bg-red-100 p-3 flex justify-between items-center border-b border-red-200">
                            <span className="font-bold text-red-700 flex items-center"><FiList className='w-4 h-4 mr-2'/>LIST</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleRestoreList(trashList._id)}
                                    className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition"
                                    title="Restore list"
                                >
                                    <ArchiveRestore className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handlePermanentDeleteList(boardData._id, trashList._id)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition"
                                    title="Permanently delete list"
                                >
                                    <FiTrash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-3 text-sm space-y-1">
                            <p className="text-gray-600 truncate"><span className='font-semibold text-gray-800'>Title:</span> {trashList.title}</p>
                            <p className="text-xs text-gray-500 truncate">ID: {trashList._id}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          )}

          {trashCards.length > 0 && (
            <div className="space-y-3">
                <h3 className='text-xl font-bold text-red-700'>Deleted Cards ({trashCards.length})</h3>
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                    {trashCards.map((trashCard, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl overflow-hidden w-full flex flex-col shadow-lg border border-red-200 transition hover:shadow-xl"
                    >
                        <div className="bg-red-100 p-3 flex justify-between items-center border-b border-red-200">
                            <span className="font-bold text-red-700 flex items-center"><FiCreditCard className='w-4 h-4 mr-2'/>CARD</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleRestoreCard(trashCard.list,trashCard._id)}
                                    className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition"
                                    title="Restore card"
                                >
                                    <ArchiveRestore className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handlePermanentDeleteCard(boardData._id, trashCard.list,trashCard._id)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition"
                                    title="Permanently delete card"
                                >
                                    <FiTrash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-3 text-sm space-y-1">
                            <p className="text-gray-600 truncate"><span className='font-semibold text-gray-800'>Title:</span> {trashCard.title}</p>
                            <p className="text-xs text-gray-500 truncate">List ID: {trashCard.list}</p>
                            <p className="text-xs text-gray-500 truncate">Card ID: {trashCard._id}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          )}
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
