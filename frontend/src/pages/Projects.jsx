import React, { useState } from "react";
import { FiPlus, FiClipboard } from "react-icons/fi";

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Revamp the landing page and add animations.",
      tasks: [
        { id: 1, title: "Design Mockups", status: "In Progress" },
        { id: 2, title: "Frontend Implementation", status: "Pending" },
      ],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description)
      return alert("Please fill all fields");

    const project = {
      id: Date.now(),
      ...newProject,
      tasks: [],
    };

    setProjects([...projects, project]);
    setNewProject({ name: "", description: "" });
    setShowForm(false);
  };

  const handleAddTask = (projectId) => {
    const taskTitle = prompt("Enter task title:");
    if (!taskTitle) return;

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId
          ? {
              ...proj,
              tasks: [
                ...proj.tasks,
                { id: Date.now(), title: taskTitle, status: "Pending" },
              ],
            }
          : proj
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <FiPlus className="mr-2" /> New Project
        </button>
      </div>

      {/* Create Project Form */}
      {showForm && (
        <form
          onSubmit={handleCreateProject}
          className="bg-white shadow rounded-lg p-6 mb-6"
        >
          <h2 className="text-lg font-medium mb-4">Create New Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="text"
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Create Project
            </button>
          </div>
        </form>
      )}

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center mb-2">
                <FiClipboard className="text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {project.name}
                </h2>
              </div>
              <p className="text-gray-600 mb-3">{project.description}</p>

              <h3 className="text-sm font-medium text-gray-700 mb-2">Tasks:</h3>
              <ul className="space-y-2">
                {project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg text-sm"
                    >
                      <span>{task.title}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          task.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No tasks yet</p>
                )}
              </ul>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => handleAddTask(project.id)}
                className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                + Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
