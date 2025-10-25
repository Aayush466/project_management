import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { Users, FolderKanban, ListChecks, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Projects", value: "8", icon: <FolderKanban className="text-white" size={24} />, color: "bg-blue-500" },
    { title: "Team Members", value: "12", icon: <Users className="text-white" size={24} />, color: "bg-green-500" },
    { title: "Active Tasks", value: "23", icon: <ListChecks className="text-white" size={24} />, color: "bg-yellow-500" },
    { title: "Completed Tasks", value: "16", icon: <CheckCircle className="text-white" size={24} />, color: "bg-purple-500" },
  ];

  const activities = [
    { user: "Ayush Shah", action: "created a new project", time: "2h ago" },
    { user: "Riya Mehta", action: "completed task UI Design", time: "4h ago" },
    { user: "Karan Patel", action: "joined the team", time: "1d ago" },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <Topbar userName="Ayush" />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Activities</h3>
          <ul className="space-y-3">
            {activities.map((act, i) => (
              <li
                key={i}
                className="flex justify-between border-b border-gray-100 pb-2 last:border-0"
              >
                <span>
                  <strong>{act.user}</strong> {act.action}
                </span>
                <span className="text-sm text-gray-500">{act.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};


