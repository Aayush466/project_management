import React, { useState } from "react";
import {
  FiPlus,
  FiMoreHorizontal,
  FiAlignLeft,
  FiX,
  FiActivity,
  FiUser,
  FiCalendar,
  FiTag,
  FiCheckSquare,
  FiLink,
  FiImage,
  FiBold,
  FiItalic,
} from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// --- TaskDetailModal Component ---
const TaskDetailModal = ({ task, listName, onClose, onUpdateTask }) => {
  const [description, setDescription] = useState(task.description);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [originalDescription, setOriginalDescription] = useState(task.description);

  const handleDescriptionSave = () => {
    onUpdateTask(task.id, { description });
    setOriginalDescription(description);
  };

  const handleDescriptionCancel = () => {
    setDescription(originalDescription);
  };

  return (
    <div
      className="fixed inset-0  flex justify-center items-start pt-10 z-50 overflow-y-auto"  //bg-black bg-opacity-50
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] mx-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-start sticky top-0 bg-white rounded-t-lg z-10">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex-shrink-0 mt-1"></div>
            <h2 className="text-2xl font-semibold text-gray-800 flex-1">
              {task.title}
            </h2>
          </div>

          <div className="flex items-center space-x-3 relative">
            <button
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={() => setShowDeleteOption(!showDeleteOption)}
            >
              <FiMoreHorizontal />
            </button>

            {showDeleteOption && (
              <div className="absolute right-8 top-8 w-32 bg-white border rounded-md shadow-md z-20">
                <button
                  onClick={() => {
                    alert("Delete clicked! (You can hook up logic here)");
                    setShowDeleteOption(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete Task
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-900"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col space-y-6">
          {/* List Name */}
          <p className="text-sm text-gray-600 mb-4">
            In list <span className="font-medium underline">{listName}</span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap space-x-2 mb-6">
            <button className="flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 transition">
              <FiPlus className="mr-1" /> Add
            </button>
            <button className="flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 transition">
              <FiTag className="mr-1" /> Labels
            </button>
            <button className="flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 transition">
              <FiCalendar className="mr-1" /> Dates
            </button>
            <button className="flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 transition">
              <FiCheckSquare className="mr-1" /> Checklist
            </button>
            <button className="flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 transition">
              <FiUser className="mr-1" /> Members
            </button>
          </div>

          {/* --- Description Always Visible --- */}
          <div className="mb-6">
            <h3 className="flex items-center text-lg font-medium text-gray-800 mb-2">
              <FiAlignLeft className="mr-2" /> Description
            </h3>

            <div className="border border-gray-300 rounded shadow-md">
              {/* Toolbar */}
              <div className="flex justify-between items-center p-2 bg-gray-50 border-b">
                <div className="flex space-x-3 text-gray-600">
                  <button className="flex items-center text-sm font-semibold">
                    Aa <span className="text-xs ml-1">v</span>
                  </button>
                  <button className="text-lg"><FiBold /></button>
                  <button className="text-lg"><FiItalic /></button>
                  <span className="text-gray-300">|</span>
                  <button className="text-lg"><FiLink /></button>
                  <button className="text-lg"><FiImage /></button>
                  <button className="text-lg"><FiPlus /></button>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                className="w-full p-3 text-sm border-none outline-none resize-none"
                rows="8"
                placeholder="Add a detailed description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Controls */}
              <div className="flex justify-between p-3 bg-white border-t rounded-b">
                <div className="flex space-x-2">
                  <button
                    onClick={handleDescriptionSave}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleDescriptionCancel}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
                <button className="text-sm text-gray-500 hover:underline">
                  Formatting help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Projects Component ---
const Projects = () => {
  const [lists, setLists] = useState([
    {
      id: 1,
      name: "hello",
      tasks: [
        {
          id: 101,
          title: "wqdwwer",
          description: "This is a detailed description for the wqdwwer task.",
        },
        { id: 102, title: "Another Card", description: "" },
      ],
    },
  ]);

  const [newListName, setNewListName] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const [addingTaskToListId, setAddingTaskToListId] = useState(null);
  const [openMenuListId, setOpenMenuListId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const getListNameByTaskId = (taskId) => {
    for (const list of lists) {
      if (list.tasks.some((task) => task.id === taskId)) {
        return list.name;
      }
    }
    return "Unknown List";
  };

  const handleUpdateTask = (taskId, newProps) => {
    setLists((prevLists) =>
      prevLists.map((list) => ({
        ...list,
        tasks: list.tasks.map((task) =>
          task.id === taskId ? { ...task, ...newProps } : task
        ),
      }))
    );
    setSelectedTask((prevTask) =>
      prevTask ? { ...prevTask, ...newProps } : null
    );
  };

  const handleAddList = () => {
    if (newListName.trim() === "") {
      setIsAddingList(false);
      return;
    }
    const newList = {
      id: Date.now(),
      name: newListName.trim(),
      tasks: [],
    };
    setLists([...lists, newList]);
    setNewListName("");
    setIsAddingList(false);
  };

  const handleAddTask = (listId, taskTitle) => {
    if (taskTitle.trim() === "") {
      setAddingTaskToListId(null);
      return;
    }
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: [
                ...list.tasks,
                { id: Date.now(), title: taskTitle.trim(), description: "" },
              ],
            }
          : list
      )
    );
    setAddingTaskToListId(null);
  };

  const handleDeleteList = (listId) => {
    setLists((prev) => prev.filter((list) => list.id !== listId));
    setOpenMenuListId(null);
  };

  const TaskCard = ({ task }) => (
    <div
      className="bg-white rounded-md shadow-sm p-2 mb-2 cursor-pointer hover:bg-gray-50 transition flex justify-between items-start group"
      onClick={() => setSelectedTask(task)}
    >
      <p className="text-sm text-gray-800">{task.title}</p>
      <span className="text-gray-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity ml-2 pt-0.5">
        <FiAlignLeft className="inline-block" />
      </span>
    </div>
  );

  const KanbanList = ({ list }) => {
    const [newTaskTitle, setNewTaskTitle] = useState("");

    return (
      <div className="relative w-72 flex-shrink-0 bg-gray-100 bg-opacity-90 rounded-lg shadow p-3 max-h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex justify-between items-center mb-2 relative">
          <h2 className="text-sm font-semibold text-gray-800 truncate">
            {list.name}
          </h2>
          <div className="relative">
            <button
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={() =>
                setOpenMenuListId(openMenuListId === list.id ? null : list.id)
              }
            >
              <FiMoreHorizontal />
            </button>
            {openMenuListId === list.id && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10">
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                >
                  Delete List
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
          {list.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}

          {addingTaskToListId === list.id && (
            <div className="mb-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onBlur={() => handleAddTask(list.id, newTaskTitle)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask(list.id, newTaskTitle);
                  else if (e.key === "Escape") setAddingTaskToListId(null);
                }}
                placeholder="Enter a title for this card..."
                className="w-full rounded-md p-2 text-sm border-blue-500 focus:ring-blue-500 outline-none shadow-sm"
                autoFocus
              />
              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleAddTask(list.id, newTaskTitle)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm mr-2"
                >
                  Add card
                </button>
                <button
                  onClick={() => setAddingTaskToListId(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  &#x2715;
                </button>
              </div>
            </div>
          )}
        </div>

        {addingTaskToListId !== list.id && (
          <button
            onClick={() => {
              setAddingTaskToListId(list.id);
              setNewTaskTitle("");
            }}
            className="flex items-center text-sm text-gray-500 hover:text-gray-800 py-2 mt-2 transition"
          >
            <FiPlus className="mr-1" /> Add a card
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div
          className="flex-1 p-4 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1549896792-74d32d4314e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080')`,
          }}
        >
          <div className="flex justify-between items-center mb-4 text-white">
            <h1 className="text-xl font-bold">hello</h1>
            <div className="flex items-center space-x-3">
              <button className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-sm transition">
                Share
              </button>
              <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-sm font-bold">
                AS
              </div>
            </div>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-4 items-start">
            {lists.map((list) => (
              <KanbanList key={list.id} list={list} />
            ))}

            {isAddingList ? (
              <div className="w-72 flex-shrink-0 bg-gray-200 bg-opacity-90 rounded-lg p-3">
                <input
                  type="text"
                  placeholder="Enter list title..."
                  className="w-full p-2 rounded-md text-sm mb-2 outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onBlur={handleAddList}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                    if (e.key === "Escape") setIsAddingList(false);
                  }}
                  autoFocus
                />
                <div className="flex items-center">
                  <button
                    onClick={handleAddList}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm mr-2"
                  >
                    Add list
                  </button>
                  <button
                    onClick={() => setIsAddingList(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    &#x2715;
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="w-72 flex-shrink-0 bg-black bg-opacity-10 hover:bg-opacity-20 rounded-lg p-3 h-12 flex items-center text-white text-sm transition"
              >
                <FiPlus className="mr-1" /> Add another list
              </button>
            )}
          </div>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(255, 255, 255, 0.3);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(255, 255, 255, 0.5);
            }
          `}</style>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          listName={getListNameByTaskId(selectedTask.id)}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default Projects;


{
  function conquor(arr, f , m , l){
    let temp = new Array(l-f+1);
    let i  = f , j = mid+1; k =0;

    while(i<=mid && j<=last){
      if(arr[i] < arr[j]){
        temp[k++] =arr[i++]
      } else temp [k++] = arr[j++]
    }

    while(i <= mid ){
      temp [k++] = arr[i++]
    }

    while(j<=last){
      temp[k++] = arr [i++]
    }
  }


  function divide(arr , first , last ){
    if(first>=last) return 
    let mid = Math.floor((first+last ) / 2);
    divide(arr , first , mid)
    divide(arr, mid +1 , last )
    conquor(arr,  first , mid , last )
  }

  let arr 
}