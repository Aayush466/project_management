// import React, { useState } from "react";
// import axios from "axios";
// import {
//   FiPlus,
//   FiMoreHorizontal,
//   FiAlignLeft,
//   FiTrash2,
// } from "react-icons/fi";

// // --- TaskCard Component ---
// const TaskCard = ({ card, listId, onOpenTask, onDeleteCard }) => (
//   <div className="bg-white rounded-md shadow-sm p-2 mb-2 cursor-pointer hover:bg-gray-50 transition flex justify-between items-start group">
//     <p className="text-sm text-gray-800" onClick={() => onOpenTask(card)}>
//       {card.title}
//     </p>
//     <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
//       <button
//         onClick={() => onDeleteCard(listId, card._id)}
//         className="text-red-500 hover:text-red-700"
//       >
//         <FiTrash2 />
//       </button>
//       <FiAlignLeft className="text-gray-400" />
//     </div>
//   </div>
// );

// // --- KanbanList Component ---
// const KanbanList = ({
//   list,
//   onAddTask,
//   onDeleteList,
//   onOpenTask,
//   onDeleteCard,
// }) => {
//   const [newTaskTitle, setNewTaskTitle] = useState("");
//   const [isAddingTask, setIsAddingTask] = useState(false);
//   const [openMenuListId, setOpenMenuListId] = useState(null);

//   const handleAddTaskSubmit = () => {
//     if (newTaskTitle.trim() === "") {
//       setIsAddingTask(false);
//       return;
//     }
//     onAddTask(list._id, newTaskTitle);
//     setNewTaskTitle("");
//     setIsAddingTask(false);
//   };

//   return (
//     <div className="relative w-72 flex-shrink-0 bg-gray-100 bg-opacity-90 rounded-lg shadow p-3 max-h-[calc(100vh-8rem)] flex flex-col">
//       <div className="flex justify-between items-center mb-2 relative">
//         <h2 className="text-sm font-semibold text-gray-800 truncate">
//           {list.title}
//         </h2>
//         <div className="relative">
//           <button
//             className="text-gray-500 hover:text-gray-700 p-1"
//             onClick={() =>
//               setOpenMenuListId(openMenuListId === list._id ? null : list._id)
//             }
//           >
//             <FiMoreHorizontal />
//           </button>
//           {openMenuListId === list._id && (
//             <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10">
//               <button
//                 onClick={() => onDeleteList(list._id)}
//                 className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
//               >
//                 Delete List
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
//         {(list.cards || []).map((card) => (
//           <TaskCard
//             // ✅ IMPROVEMENT: Use unique ID as key instead of index
//             key={card._id || card.title}
//             card={card}
//             listId={list._id}
//             onOpenTask={onOpenTask}
//             onDeleteCard={onDeleteCard}
//           />
//         ))}

//         {isAddingTask && (
//           <div className="mb-2">
//             <input
//               type="text"
//               value={newTaskTitle}
//               onChange={(e) => setNewTaskTitle(e.target.value)}
//               onBlur={handleAddTaskSubmit}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleAddTaskSubmit();
//                 else if (e.key === "Escape") setIsAddingTask(false);
//               }}
//               placeholder="Enter a title for this card..."
//               className="w-full rounded-md p-2 text-sm border-blue-500 focus:ring-blue-500 outline-none shadow-sm"
//               autoFocus
//             />
//             <div className="flex items-center mt-2">
//               <button
//                 onClick={handleAddTaskSubmit}
//                 className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm mr-2"
//               >
//                 Add card
//               </button>
//               <button
//                 onClick={() => setIsAddingTask(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 &#x2715;
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {!isAddingTask && (
//         <button
//           onClick={() => setIsAddingTask(true)}
//           className="flex items-center text-sm text-gray-500 hover:text-gray-800 py-2 mt-2 transition"
//         >
//           <FiPlus className="mr-1" /> Add a card
//         </button>
//       )}
//     </div>
//   );
// };

// // --- TaskDetailModal Component ---
// const TaskDetailModal = ({ task, listName, onClose }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
//     <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-2xl">
//       <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
//       <p>In list: {listName}</p>
//       <button
//         onClick={onClose}
//         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//       >
//         Close
//       </button>
//     </div>
//   </div>
// );

// // --- BoardView Component ---
// const BoardView = ({ boardData, onBackToDashboard }) => {
//   const [lists, setLists] = useState(
//     boardData.lists?.map((l) => ({ ...l, cards: l.cards || [] })) || []
//   );
//   const [selectedTask, setSelectedTask] = useState(null);

//   // Add Card
//   const handleAddTask = async (listId, title) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/cards/${boardData._id}/${listId}`,
//         { title },
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       // Ensure the title is included even if backend doesn’t return it
//       const createdTask = {
//         ...(response.data || {}),
//         // Use server ID or a temporary one if missing
//         _id: response.data.data?._id || Date.now().toString(),
//         title: response.data?.title || title,
//       };

//       setLists((prev) =>
//         prev.map((list) =>
//           list._id === listId
//             ? { ...list, cards: [...(list.cards || []), createdTask] }
//             : list
//         )
//       );
//     } catch (error) {
//       console.error("Error adding task:", error);
//       alert("Failed to add card. Check console for details.");
//     }
//   };

//   // Delete Card
//   const handleDeleteCard = async (listId, cardId) => {
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/cards/${boardData._id}/${listId}/${cardId}`,
//         { withCredentials: true }
//       );

//       setLists((prev) =>
//         prev.map((list) =>
//           list._id === listId
//             ? {
//                 ...list,
//                 cards: list.cards.filter((card) => card._id !== cardId),
//               }
//             : list
//         )
//       );
//     } catch (error) {
//       console.error("Error deleting card:", error);
//       alert("Failed to delete card. Check console for details.");
//     }
//   };

//   // Add List
//   const handleAddList = async (title) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/lists/${boardData._id}`,
//         { title },
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       console.log(response.data);

//       const createdList = {
//         ...(response.data || {}),
//         // ✅ CRITICAL: Ensure the list has a unique ID from the server.
//         // If the server doesn't return one, use a temporary one for display
//         _id: response.data.data?._id || Date.now().toString(),
//         title: response.data?.title || title,
//         cards: response.data?.cards || [],
//       };

//       setLists((prevLists) => [...prevLists, createdList]);
//     } catch (error) {
//       console.error("Error adding list:", error);
//       alert("Failed to add list. Check console for details.");
//     }
//   };

//   // Delete List
//   const handleDeleteList = async (listId) => {
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/lists/${boardData._id}/${listId}`,
//         { withCredentials: true }
//       );

//       setLists((prev) => prev.filter((list) => list._id !== listId));
//     } catch (error) {
//       console.error("Error deleting list:", error);
//       alert("Failed to delete list. Check console for details.");
//     }
//   };

//   const getListNameByTaskId = (taskId) => {
//     for (let list of lists) {
//       if (list.cards.some((card) => card._id === taskId)) {
//         return list.title;
//       }
//     }
//     return "";
//   };

//   const boardTitle = boardData.title;
//   const boardBg = "bg-blue-600";

//   return (
//     <div className="flex flex-col h-screen overflow-hidden">
//       {/* Top Bar */}
//       <div
//         className={`p-4 ${boardBg} text-white flex justify-between items-center flex-shrink-0`}
//       >
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onBackToDashboard}
//             className="px-2 py-1 hover:bg-white hover:bg-opacity-20 rounded transition"
//           >
//             <FiAlignLeft className="inline-block mr-1" /> Boards
//           </button>
//           <h1 className="text-xl font-bold truncate">{boardTitle}</h1>
//         </div>
//       </div>

//       {/* Kanban Board */}
//       <div
//         className="flex-1 overflow-x-auto p-4 flex space-x-4 items-start"
//         style={{ backgroundColor: "#0079bf" }}
//       >
//         {lists.map((list) => (
//           <KanbanList
//             // 🎯 FIX: Use the unique list ID as the key
//             key={list._id}
//             list={list}
//             onAddTask={handleAddTask}
//             onDeleteList={handleDeleteList}
//             onOpenTask={setSelectedTask}
//             onDeleteCard={handleDeleteCard}
//           />
//         ))}

//         {/* Add Another List Button */}
//         <button
//           onClick={() => {
//             const title = prompt("Enter list title:");
//             if (title) handleAddList(title);
//           }}
//           className="w-72 flex-shrink-0 bg-black bg-opacity-10 hover:bg-opacity-20 rounded-lg p-3 h-12 flex items-center text-white text-sm transition"
//         >
//           <FiPlus className="mr-1" /> Add another list
//         </button>
//       </div>

//       {/* Task Detail Modal */}
//       {selectedTask && (
//         <TaskDetailModal
//           task={selectedTask}
//           listName={getListNameByTaskId(selectedTask._id)}
//           onClose={() => setSelectedTask(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default BoardView;


import React, { useState } from "react";
import axios from "axios";
import {
  FiPlus,
  FiMoreHorizontal,
  FiAlignLeft,
  FiTrash2,
  FiTag,
  FiClock,
  FiCheckSquare,
  FiUsers,
} from "react-icons/fi";
import { BiDetail } from "react-icons/bi";
import { MdOutlineDescription } from "react-icons/md";

// --- TaskCard Component ---
const TaskCard = ({ card, listId, onOpenTask, onDeleteCard }) => (
  <div
    className="bg-white rounded-md shadow-sm p-2 mb-2 cursor-pointer hover:bg-gray-50 transition flex justify-between items-start group"
    onClick={() => onOpenTask(card, listId)} // ✅ Whole card clickable
  >
    <p className="text-sm text-gray-800 break-words">{card.title}</p>

    {/* Hover actions (trash + icon) */}
    <div
      className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={(e) => e.stopPropagation()} // ✅ Prevent click from opening modal when deleting
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

  const handleOpenTask = (card) => {
    onOpenTask(card, list._id);
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
            onOpenTask={handleOpenTask}
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

// --- TaskDetailModal Component ---
const TaskDetailModal = ({ task, listName, onClose }) => {
  const [description, setDescription] = useState("");

  const ActionButton = ({ icon: Icon, label }) => (
    <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-sm text-gray-700 transition">
      <Icon className="text-lg" />
      <span>{label}</span>
    </button>
  );

  const handleSave = () => {
    console.log("Saved description:", description);
    onClose();
  };

  const handleCancel = () => {
    setDescription("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking inside modal
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &#x2715;
          </button>
        </div>

        {/* Task Header */}
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
          <ActionButton icon={FiTag} label="Labels" />
          <ActionButton icon={FiClock} label="Dates" />
          <ActionButton icon={FiCheckSquare} label="Checklist" />
        </div>

        {/* Description Section */}
        <div className="flex items-start space-x-3 mb-6">
          <MdOutlineDescription className="text-2xl text-gray-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              className="w-full rounded-md p-2 text-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500 outline-none resize-none min-h-[80px] transition"
            />

            {/* ✅ Added Save / Cancel buttons */}
            <div className="flex items-center mt-3 space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
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

  // --- Open / Close Task Modal ---
  const handleOpenTask = (card, listId) => {
    const list = lists.find((l) => l._id === listId);
    if (list) {
      console.log("Opening task:", card.title, "in list:", list.title);
      setSelectedTaskDetails({
        task: card,
        listName: list.title,
      });
    }
  };

  const handleCloseTask = () => {
    setSelectedTaskDetails(null);
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
          onClose={handleCloseTask}
        />
      )}
    </div>
  );
};

export default BoardView;
