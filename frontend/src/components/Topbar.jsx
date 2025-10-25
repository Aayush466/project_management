import React from "react";
import { Bell } from "lucide-react";

const Topbar = ({ userName = "Admin" }) => {
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
          A
        </div>
      </div>
    </div>
  );
};

export default Topbar;
