import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListChecks,
  Bell,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🧠 Handle Logout Function
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true, // important if backend uses cookies
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.message == "Logout successful") {
        // ✅ Clear token if using localStorage
        localStorage.removeItem("token");

        // Redirect to login page
        navigate("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert(
        error.response?.data?.message || "Something went wrong during logout."
      );
    }
  };

  const links = [
    // {
    //   name: "Overview",
    //   path: "/overview",
    //   icon: <LayoutDashboard size={20} />,
    // },
    { name: "Team", path: "/team", icon: <Users size={20} /> },
    { name: "Board", path: "/projects", icon: <FolderKanban size={20} /> },
    // { name: "Tasks", path: "/tasks", icon: <ListChecks size={20} /> },
    { name: "Invitation", path: "/invitation", icon: <Bell size={20} /> },
  ];

  return (
    <div className="h-screen bg-[#7B3931] text-white w-64 p-5 flex flex-col justify-between">
      {/* ---- Top Section ---- */}
      <div>
        <h1 className="text-2xl font-bold mb-8 text-center">Project Manager</h1>
        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                location.pathname === link.path
                  ? "bg-white text-[#7B3931] font-semibold"
                  : "hover:bg-[#934940]"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* ---- Logout Button ---- */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 px-4 py-2 mt-6 rounded-lg hover:bg-[#934940] transition-all text-left cursor-pointer"
      >
        <Settings size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;