import React from "react";
import { BellIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";

export default function Header() {
  return (
    <header className="w-full bg-[#0d1117] text-gray-100 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* -------- Logo -------- */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-lg">
            S
          </div>
          <span className="text-xl font-semibold tracking-wide">ShivaTeam</span>
        </div>

        {/* -------- Buttons Section -------- */}
        <div className="flex items-center space-x-4">
          {/* Team Members */}
          <button className="flex items-center gap-2 bg-[#161b22] hover:bg-[#1f242d] text-gray-300 px-4 py-2 rounded-xl transition-all duration-200 border border-gray-700">
            <UsersIcon className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">0 Team Members</span>
          </button>

          {/* Invite User */}
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-emerald-600/30">
            <UserPlusIcon className="w-5 h-5" />
            Invite User
          </button>

          {/* Notifications */}
          <button className="relative bg-[#161b22] hover:bg-[#1f242d] p-2 rounded-xl transition-all duration-200 border border-gray-700">
            <BellIcon className="w-6 h-6 text-gray-300" />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
