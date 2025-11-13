import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FolderKanban,
  Settings,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, onClose }) => {
  const isAdmin = useSelector(state => state.profile.admin);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.message === "Logout successful") {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Something went wrong during logout."
      );
    }
  };

  // Click-away logic (desktop and mobile)
  useEffect(() => {
    if (!isOpen) return;

    // Handler to check if click is outside the sidebar
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose(false);
      }
    };

    // Handler for Escape key to close
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const links = isAdmin
    ? [
        { name: "Board", path: "/dashboard", icon: <FolderKanban size={20} /> },
        {
          name: "Approve User",
          path: "/approve",
          icon: <FolderKanban size={20} />,
        },
        { name: "Trash", path: "/trash", icon: <FolderKanban size={20} /> },
      ]
    : [
        { name: "Board", path: "/dashboard", icon: <FolderKanban size={20} /> },
        { name: "Trash", path: "/trash", icon: <FolderKanban size={20} /> },
      ];

  const sidebarClasses = `
    fixed top-0 left-0 h-screen bg-[#7B3931] text-white z-40 
    p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out
    w-64
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    sm:relative sm:translate-x-0 sm:w-64 sm:flex 
  `;
  const overlayClasses = `
    fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300
    sm:hidden 
    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
  `;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={overlayClasses}
        onClick={() => onClose(false)}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <div ref={sidebarRef} className={sidebarClasses}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">Project Manager</h1>
          {/* Close (mobile only) */}
          <button
            onClick={() => onClose(false)}
            className="sm:hidden p-1 rounded-full hover:bg-[#934940]"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow">
          <nav className="space-y-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => onClose(false)}
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
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2 mt-6 rounded-lg hover:bg-[#934940] transition-all text-left cursor-pointer w-full"
        >
          <Settings size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
