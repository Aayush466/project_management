import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const sample = () => {
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("");

        const username = response.data?.data?.username || "User";
        setUserName(username);
      } catch (error) {
        console.error("Error fetching user data ", error);
        setUserName("User");
      }
    };

    fetchUserName();
  }, []);

  return (
    <>
    <div className="flex justify-between items-center bg-white shadow px-6 py-3 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700">
            Welcome back, {userName}
        </h2>

        <div className="flex items-center space-x-4">
            <button className="relative">
                <Bell size={22} className="text-gray-600"/>
                <span className="absolute -top-1 ">
                    3
                </span>
            </button>
        </div>

    </div>
    </>
  )
};

export default sample;
