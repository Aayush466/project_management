import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Lock, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";

// --- Animation Variants ---
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

export default function UpdateUserModal({ onClose, onUpdate, user }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Handle Submit
  const handleSubmit = async () => {
    setError(""); // Clear previous errors

    if (!name && !password) {
      setError("Please enter at least one field to update.");
      return;
    }

    const updatedData = {email: user.email};
    if (name.trim() !== "") {
      updatedData.name = name.trim();
    }
    if (password.trim() !== "") {
      updatedData.password = password.trim();
    }

    try {
      // Call your backend API (replace with your real endpoint)
      const response = await axios.put(
        "http://localhost:5000/api/users/user-profile",
        updatedData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess(true);
        if (onUpdate) onUpdate({ name, password });
      }
    } catch (error) {
      console.error("Updating Failed:", error);
      alert(
        error.response.data.message ||
          "An error occurred while updating profile."
      );
    }

    // Trigger parent update logic
  };

  // Auto-close after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose} // Close on backdrop click
      >
        {/* Modal Container */}
        <motion.div
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
        >
          {/* Close Button (Top Right) */}
          {!success && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors z-10"
            >
              <X size={20} />
            </button>
          )}

          {/* Content Switcher (Form vs Success) */}
          <AnimatePresence mode="wait">
            {success ? (
              // --- Success State ---
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.1,
                  }}
                  className="mb-4 text-green-500"
                >
                  <CheckCircle size={64} strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  Success!
                </h3>
                <p className="text-gray-500">Profile updated successfully.</p>
              </motion.div>
            ) : (
              // --- Form State ---
              <motion.div
                key="form"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-8"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Update User({user.name})
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Modify your account details below.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <User size={14} className="text-gray-400" /> Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter new name"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#7B3931] focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Lock size={14} className="text-gray-400" /> Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#7B3931] focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-3 justify-end">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-[#7B3931] hover:bg-[#632d26] shadow-md hover:shadow-lg transition-all"
                  >
                    Update
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
