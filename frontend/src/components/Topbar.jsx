import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bell, Upload } from "lucide-react";

const Topbar = () => {
  const [user, setUser] = useState({
    username: "Loading...",
    avatar: null,
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/profile",
          { withCredentials: true }
        );

        const userData = response.data?.data || {};
        setUser({
          username: userData.username || "User",
          avatar: userData.avatar || null,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser({ username: "User", avatar: null });
      }
    };

    fetchUserProfile();
  }, []);

  // ✅ Handle file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/upload-avatar",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newAvatar = response.data?.data?.avatar;
      if (newAvatar) {
        setUser((prev) => ({ ...prev, avatar: newAvatar }));
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload profile photo");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Open file picker when avatar clicked
  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700">
        Welcome back, {user.username} 👋
      </h2>

      <div className="flex items-center space-x-4">
        {/* 🔔 Notification Bell */}
        <button className="relative">
          <Bell size={22} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        {/* 👤 Clickable Avatar */}
        <div
          onClick={handleAvatarClick}
          className="relative cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 font-semibold text-gray-700 hover:opacity-80 transition"
          title="Click to upload profile photo"
        >
          {uploading ? (
            <Upload className="animate-pulse text-gray-600" size={20} />
          ) : user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span>{user.username ? user.username.charAt(0).toUpperCase() : "U"}</span>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
