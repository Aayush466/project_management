import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const Topbar = () => {
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:8000/api/v1/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ Adjusted to match your backend structure
        const username = response.data?.data?.username || "User";
        setUserName(username);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("User");
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700">
        Welcome back, {userName} 👋
      </h2>

      <div className="flex items-center space-x-4">
        <button className="relative">
          <Bell size={22} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-semibold text-gray-700">
          {userName ? userName.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
