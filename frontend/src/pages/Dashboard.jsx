import React from "react";

export default function Dashboard() {
  const tasks = {
    notAssigned: [
      { id: 1, title: "Design homepage layout", description: "Awaiting team assignment", createdAt: "2025-10-18", deadline: "2025-10-25", assignedTo: "Unassigned" },
      { id: 2, title: "Database schema setup", description: "No developer assigned yet", createdAt: "2025-10-16", deadline: "2025-10-22", assignedTo: "Unassigned" },
    ],
    pending: [
      { id: 3, title: "API integration", description: "In progress by backend team", createdAt: "2025-10-15", deadline: "2025-10-28", assignedTo: "shiva123@gmail.com" },
      { id: 4, title: "UI improvements", description: "Pending review", createdAt: "2025-10-14", deadline: "2025-10-27", assignedTo: "john.doe@gmail.com" },
    ],
    completed: [
      { id: 5, title: "Project setup", description: "Completed successfully", createdAt: "2025-10-12", deadline: "2025-10-14", assignedTo: "alice@example.com" },
      { id: 6, title: "Auth module", description: "Fully tested and merged", createdAt: "2025-10-10", deadline: "2025-10-13", assignedTo: "bob@example.com" },
    ],
    all: [
      { id: 1, title: "Design homepage layout", status: "Not Assigned", createdAt: "2025-10-18", deadline: "2025-10-25", assignedTo: "Unassigned" },
      { id: 2, title: "Database schema setup", status: "Not Assigned", createdAt: "2025-10-16", deadline: "2025-10-22", assignedTo: "Unassigned" },
      { id: 3, title: "API integration", status: "Pending", createdAt: "2025-10-15", deadline: "2025-10-28", assignedTo: "shiva123@gmail.com" },
      { id: 4, title: "UI improvements", status: "Pending", createdAt: "2025-10-14", deadline: "2025-10-27", assignedTo: "john.doe@gmail.com" },
      { id: 5, title: "Project setup", status: "Completed", createdAt: "2025-10-12", deadline: "2025-10-14", assignedTo: "alice@example.com" },
      { id: 6, title: "Auth module", status: "Completed", createdAt: "2025-10-10", deadline: "2025-10-13", assignedTo: "bob@example.com" },
    ],
  };

  // Sort tasks by created date descending (newest first)
  const sortByDateDesc = (taskArray) =>
    taskArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sectionStyle =
    "bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200";
  const cardStyle =
    "bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-lg p-3 border border-gray-200";

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-6 py-8 font-sans">
      {/* ---------- Header ---------- */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-green-600 tracking-wide">
          Task Management Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Overview of all your team’s tasks categorized by status
        </p>
      </div>

      {/* ---------- Dashboard Grid ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side (3 Compact Sections) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Not Assigned Tasks */}
          <div className={sectionStyle}>
            <h2 className="text-base font-semibold text-red-500 mb-2">Not Assigned</h2>
            <div className="space-y-2">
              {sortByDateDesc(tasks.notAssigned).map((task) => (
                <div key={task.id} className={cardStyle}>
                  <h3 className="text-sm font-medium">{task.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {task.createdAt} | Deadline: {task.deadline}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Assigned To: {task.assignedTo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className={sectionStyle}>
            <h2 className="text-base font-semibold text-yellow-500 mb-2">Pending</h2>
            <div className="space-y-2">
              {sortByDateDesc(tasks.pending).map((task) => (
                <div key={task.id} className={cardStyle}>
                  <h3 className="text-sm font-medium">{task.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {task.createdAt} | Deadline: {task.deadline}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Assigned To: {task.assignedTo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className={sectionStyle}>
            <h2 className="text-base font-semibold text-green-500 mb-2">Completed</h2>
            <div className="space-y-2">
              {sortByDateDesc(tasks.completed).map((task) => (
                <div key={task.id} className={cardStyle}>
                  <h3 className="text-sm font-medium">{task.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {task.createdAt} | Deadline: {task.deadline}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Assigned To: {task.assignedTo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side (Large All Tasks Section) */}
        <div className="lg:col-span-3">
          <div className={`${sectionStyle} h-full`}>
            <h2 className="text-lg font-semibold text-blue-500 mb-3">All Tasks</h2>
            <div className="space-y-3">
              {sortByDateDesc(tasks.all).map((task) => (
                <div key={task.id} className={cardStyle}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{task.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {task.createdAt} | Deadline: {task.deadline}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Assigned To: {task.assignedTo}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
