import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // 👈 Import motion and AnimatePresence

const Register = () => {
  const [step, setStep] = useState("register"); // "register" | "verify"
  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    userpassword: "",
    role: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Define Framer Motion Variants
  const formWrapperVariants = {
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

  const formStepVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const messageVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
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

  // 🔹 Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name: formData.username,
          email: formData.useremail,
          password: formData.userpassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage(
        "✅ Registration successful! Please check your email for OTP."
      );
      setStep("verify");
    } catch (error) {
      console.error("Axios Error:", error);
      setMessage(
        `❌ ${
          error.response?.data?.message ||
          "Registration failed. Please try again."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle OTP Verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/submit-otp",
        {
          email: formData.useremail,
          otp,
        },
        { withCredentials: true }
      );

      setMessage("✅ User verified successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("OTP Error:", error);
      setMessage(
        `❌ ${
          error.response?.data?.message || // Fixed: Used error.response?.data?.message
          "OTP verification failed. Please try again."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <motion.div
        variants={formWrapperVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full sm:w-96 border border-gray-100 overflow-hidden" // Added overflow-hidden for AnimatePresence
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          {step === "register" ? "Create Account" : "Verify Account"}
        </motion.h2>

        {/* --- Form Steps Container --- */}
        <AnimatePresence mode="wait">
          {/* ========================== REGISTER FORM ========================== */}
          {step === "register" && (
            <motion.form
              key="registerForm"
              onSubmit={handleRegister}
              variants={formStepVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={{ duration: 0.3 }}
            >
              {/* Full Name */}
              <motion.div variants={itemVariants}>
                <motion.input
                  type="text"
                  placeholder="Full Name"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-4 focus:ring-[#7B3931]/30 transition duration-300"
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants}>
                <motion.input
                  type="email"
                  placeholder="Email"
                  value={formData.useremail}
                  onChange={(e) =>
                    setFormData({ ...formData, useremail: e.target.value })
                  }
                  className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-4 focus:ring-[#7B3931]/30 transition duration-300"
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <motion.input
                  type="password"
                  placeholder="Password"
                  value={formData.userpassword}
                  onChange={(e) =>
                    setFormData({ ...formData, userpassword: e.target.value })
                  }
                  className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-4 focus:ring-[#7B3931]/30 transition duration-300"
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                variants={itemVariants}
                whileTap={{ scale: 0.98, backgroundColor: "#552721" }}
                className="w-full bg-[#7B3931] text-white py-3.5 rounded-xl text-lg font-semibold hover:bg-[#622d26] disabled:opacity-50 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? "Processing..." : "Register"}
              </motion.button>
            </motion.form>
          )}

          {/* ========================== OTP FORM ========================== */}
          {step === "verify" && (
            <motion.form
              key="verifyForm"
              onSubmit={handleOtpSubmit}
              variants={formStepVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={{ duration: 0.3 }}
            >
              <p className="text-center text-gray-600 mb-4 text-sm">
                We’ve sent an OTP to{" "}
                <span className="font-semibold">{formData.useremail}</span>.
              </p>

              {/* OTP Input */}
              <motion.div variants={itemVariants}>
                <motion.input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl mb-6 text-center text-lg tracking-widest focus:outline-none focus:ring-4 focus:ring-green-600/30 transition duration-300"
                  required
                  maxLength={6}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              {/* Submit OTP */}
              <motion.button
                type="submit"
                disabled={loading}
                variants={itemVariants}
                whileTap={{ scale: 0.98, backgroundColor: "#065f46" }}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl text-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? "Verifying..." : "Verify Account"}
              </motion.button>

              {/* Resend OTP */}
              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className="mt-4 w-full text-[#7B3931] font-semibold hover:underline text-sm"
              >
                Resend OTP
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ========================== MESSAGE & LINK ========================== */}
        <AnimatePresence>
          {message && (
            <motion.div
              key="statusMessage"
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`mt-6 p-3 rounded-lg text-center font-medium ${
                message.includes("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-gray-500 text-sm sm:text-base flex justify-center gap-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#7B3931] font-bold hover:underline"
          >
            Login Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;