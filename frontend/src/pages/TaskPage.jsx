import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Plus, Edit, Trash2 } from "lucide-react";
// import AddTaskModal from "../components/AddTaskModal";

const TasksPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design login page",
      assignedTo: "Riya Mehta",
      deadline: "2025-10-30",
      status: "In Progress",
      priority: "High",
    },
    {
      id: 2,
      title: "Setup database schema",
      assignedTo: "Karan Patel",
      deadline: "2025-10-28",
      status: "Pending",
      priority: "Medium",
    },
  ]);

  const handleAddTask = (task) => {
    setTasks([...tasks, { id: Date.now(), ...task }]);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        <Topbar userName="Ayush (Admin)" />

        {/* Header */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Task Management
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-[#7B3931] text-white px-4 py-2 rounded-lg hover:bg-[#934940] transition"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Task Table */}
        <div className="bg-white shadow rounded-xl mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left text-sm uppercase tracking-wider">
                <th className="p-4">Task</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-700">
                    {task.title}
                  </td>
                  <td className="p-4 text-gray-600">{task.assignedTo}</td>
                  <td className="p-4 text-gray-600">{task.deadline}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-3">
                    <button className="text-blue-500 hover:text-blue-700 transition">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tasks.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No tasks created yet.
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTask}
        />
      )}
    </div>
  );
};

export default TasksPage;
