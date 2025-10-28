import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { CheckCircle, Mail, XCircle } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "invite",
      message: "Invitation sent to john@example.com",
      status: "unread",
      time: "2h ago",
    },
    {
      id: 2,
      type: "task",
      message: "Ayush completed the task 'UI Design'",
      status: "read",
      time: "4h ago",
    },
    {
      id: 3,
      type: "invite",
      message: "Invitation sent to riya@example.com",
      status: "unread",
      time: "1d ago",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, status: "read" } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        <Topbar userName="Ayush" />

        <h1 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
          Notifications
        </h1>

        <div className="bg-white shadow rounded-xl p-6">
          {notifications.length === 0 && (
            <p className="text-gray-500 text-center py-10">No notifications</p>
          )}

          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`flex justify-between items-center p-4 rounded-lg border ${
                  notif.status === "unread"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {notif.type === "invite" ? (
                    <Mail className="text-blue-500" />
                  ) : (
                    <CheckCircle className="text-green-500" />
                  )}
                  <div>
                    <p className="text-gray-700">{notif.message}</p>
                    <span className="text-xs text-gray-400">{notif.time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {notif.status === "unread" && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
