import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion"; // 👈 Import motion

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Define Framer Motion Variants for components
  const formVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const messageVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };


  // ✅ Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          credentials: "include", // include cookies
        });

        const data = await res.json();
        if (data?.success && data?.data?._id) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.warn("User not logged in yet.");
      }
    };

    checkAuth();
  }, [navigate]);

  // ✅ Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true }
      );

      if (response?.data?.message === "Login successful") {
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setMessage("❌ Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error.response || error.message);
      setMessage(error.response.data.message || "❌ Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <motion.form // 👈 Applied form animation
        onSubmit={handleSubmit}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full sm:w-96 border border-gray-100"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Welcome Back 👋
        </motion.h2>

        {/* Email */}
        <motion.div variants={itemVariants}>
          <motion.input // 👈 Applied animation for focus
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-4 focus:ring-[#7B3931]/30 transition duration-300"
            required
            whileFocus={{ scale: 1.01 }}
          />
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants}>
          <motion.input // 👈 Applied animation for focus
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-4 focus:ring-[#7B3931]/30 transition duration-300"
            required
            whileFocus={{ scale: 1.01 }}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button // 👈 Applied animation for tap/press
          type="submit"
          disabled={loading}
          variants={itemVariants}
          whileTap={{ scale: 0.98, backgroundColor: "#552721" }}
          className="w-full bg-[#7B3931] text-white py-3.5 rounded-xl text-lg font-semibold hover:bg-[#622d26] disabled:opacity-50 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </motion.button>

        {/* Registration Link */}
        <motion.p variants={itemVariants} className="mt-6 text-center text-gray-500 text-sm sm:text-base">
          Don't have an account?{" "}
          <Link to="/" className="text-[#7B3931] font-bold hover:underline">
            Register Here
          </Link>
        </motion.p>

        {/* Message */}
        {message && (
          <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </motion.div>
        )}
      </motion.form>
    </div>
  );
};

export default Login;
