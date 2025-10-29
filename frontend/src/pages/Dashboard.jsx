import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { Users, FolderKanban, ListChecks, CheckCircle } from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMembers: 0,
    activeTasks: 0,
    completedTasks: 0,
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          projectsRes,
          membersRes,
          activeTasksRes,
          completedTasksRes,
          activitiesRes,
        ] = await Promise.all([
          axios.get("/api/projects/count"),
          axios.get("/api/users/count"),
          axios.get("/api/tasks/active"),
          axios.get("/api/tasks/completed"),
          axios.get("/api/activities/recent"),
        ]);

        setStats({
          totalProjects: projectsRes.data?.totalProjects || 0,
          totalMembers: membersRes.data?.totalMembers || 0,
          activeTasks: activeTasksRes.data?.activeTasks || 0,
          completedTasks: completedTasksRes.data?.completedTasks || 0,
        });

        // ✅ Always fallback to empty array if undefined
        setActivities(activitiesRes.data?.activities || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setActivities([]); // prevent crash if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: <FolderKanban className="text-white" size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Team Members",
      value: stats.totalMembers,
      icon: <Users className="text-white" size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Active Tasks",
      value: stats.activeTasks,
      icon: <ListChecks className="text-white" size={24} />,
      color: "bg-yellow-500",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: <CheckCircle className="text-white" size={24} />,
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-lg">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <Topbar userName="Ayush" />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {statCards.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Activities
          </h3>
          {Array.isArray(activities) && activities.length > 0 ? (
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
          ) : (
            <p className="text-gray-500 text-sm">No recent activities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}