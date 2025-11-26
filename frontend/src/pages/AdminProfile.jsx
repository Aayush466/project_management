import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { ShieldCheck, Camera, User, Lock, Save } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // 👈 Import motion and AnimatePresence
import { useNavigate } from "react-router-dom";

// --- Framer Motion Variants ---
const mainContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, when: "beforeChildren" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.1 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// --- END: TrashBoards ---

export default function AdminProfile() {
  const [openSideBar, setOpenSideBar] = useState(false);

  // --- Redux State ---
  const isAdmin = useSelector((state) => state.profile?.admin);
  const [adminName, setAdminName] = useState(
    useSelector((state) => state.profile?.user.name)
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Local Form State ---
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedData = {};
    if (formData.name.trim() !== "") {
      updatedData.name = formData.name.trim();
    }
    if (formData.password.trim() !== "") {
      updatedData.password = formData.password.trim();
    }

    if (formData.name.trim() === "" && formData.password.trim() === "") {
      alert("Please enter at least one field to update.");
      setIsLoading(false);
      return;
    }

    try {
      // Call your backend API (replace with your real endpoint)
      const response = await axios.put(
        "http://localhost:5000/api/users/admin-profile",
        updatedData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setAdminName(updatedData.name || adminName);
        alert("Profile updated successfully.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Updating Failed:", error);
      alert(
        error.response.data.message ||
          "An error occurred while updating profile."
      );
      setIsLoading(false);
    }
  };

  // --- Main Render ---
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar isOpen={openSideBar} onClose={setOpenSideBar} />

      {/* Main Layout Wrapper */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        <Topbar handleOpenSideBar={setOpenSideBar} />

        <motion.div
          variants={mainContentVariants}
          initial="hidden"
          animate="visible"
          className="p-4 md:p-8 w-full max-w-3xl mx-auto"
        >
          {/* Page Header - Compact */}
          <div className="flex items-center mb-6 border-b border-gray-200 pb-3">
            {/* Theme Color Light Background for Icon */}
            <div className="p-1.5 bg-[#7B3931]/10 rounded-lg mr-3">
              <ShieldCheck className="w-5 h-5 text-[#7B3931]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              {isAdmin?"Admin":"User"} Profile
            </h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key="profile-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Responsive Flex Container: Stack on mobile, Row on Desktop */}
              <div className="flex flex-col md:flex-row">
                {/* Left Side: Identity */}
                <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 text-center">
                  {/* Avatar with Theme Color */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#7B3931] flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-md mb-3 select-none">
                    {adminName ? adminName.charAt(0).toUpperCase() : "A"}
                  </div>

                  <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate w-full px-2">
                    {adminName || "Administrator"}
                  </h2>
                  {/* Role Text with Theme Color */}
                  <p className="text-xs text-[#7B3931] font-bold uppercase tracking-wide mt-1">
                    {isAdmin ? "Super Admin" : "User"}
                  </p>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-2/3 p-6 md:p-8">
                  <div className="mb-5">
                    <h3 className="text-base font-semibold text-gray-900">
                      Update Credentials
                    </h3>
                    <p className="text-xs text-gray-500">
                      Manage your display name and security access.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                        <User size={14} /> Display Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={adminName || "Enter new name"}
                        disabled={!isAdmin}
                        // Focus ring uses theme color
                        className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-[#7B3931] focus:border-transparent transition-all outline-none bg-white hover:bg-gray-50 focus:bg-white"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                        <Lock size={14} /> New Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          disabled={!isAdmin}
                          // Focus ring uses theme color
                          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-[#7B3931] focus:border-transparent transition-all outline-none bg-white hover:bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <p className={`text-[10px] text-gray-400 text-right ${!isAdmin?"hidden":""}`}>
                        Min. 8 chars. Leave blank to keep current.
                      </p>
                    </div>

                    {/* Button Area */}
                    <div className={`pt-4 border-t border-gray-100 flex justify-end ${!isAdmin?"hidden":""}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        // Background uses theme color, hover uses a slightly darker hex (manually calculated)
                        className="flex items-center gap-2 bg-[#7B3931] hover:bg-[#5e2b25] text-white px-5 py-2 rounded-md text-sm font-medium shadow-md transition-all disabled:opacity-70"
                      >
                        {isLoading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        Save
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
