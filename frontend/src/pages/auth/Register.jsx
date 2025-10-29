import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

  // 🔹 Check Authentication on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Step 1: Check if user is already logged in
        // const res = await fetch("http://localhost:8000/api/v1/users/check", {
        //   credentials: "include", // send cookies
        // });

        // if (res.status === 200) {
        //   const data = await res.json();
        //   if (data?.data?.isAuthenticated) {
        //     navigate("/dashboard");
        //     return;
        //   }
        // }

        // Step 2: Try refreshing token if not authenticated
        const refreshRes = await axios.post(
          "localhost:5000/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        if (refreshRes?.data?.isAuthenticated) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Do nothing — user can continue to register
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
      const response = await axios.post(
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
      const response = await axios.post(
        "http://localhost:5000/api/auth/submit-otp",
        {
          email: formData.useremail,
          otp,
        },
        {withCredentials:true}
      );

      setMessage("✅ User verified successfully! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("OTP Error:", error);
      setMessage(
        `❌ ${
          error.response?.message ||
          "OTP verification failed. Please try again."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full sm:w-96 border">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#7B3931]">
          {step === "register" ? "Register" : "Verify OTP"}
        </h2>

        {/* ========================== REGISTER FORM ========================== */}
        {step === "register" && (
          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#7B3931]"
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={formData.useremail}
              onChange={(e) =>
                setFormData({ ...formData, useremail: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#7B3931]"
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={formData.userpassword}
              onChange={(e) =>
                setFormData({ ...formData, userpassword: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#7B3931]"
              required
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7B3931] text-white py-3 rounded-lg hover:bg-[#622d26] disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>
        )}

        {/* ========================== OTP FORM ========================== */}
        {step === "verify" && (
          <form onSubmit={handleOtpSubmit}>
            <p className="text-center text-gray-600 mb-4 text-sm">
              We’ve sent an OTP to{" "}
              <span className="font-semibold">{formData.useremail}</span>.
            </p>

            {/* OTP Input */}
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#7B3931]"
              required
            />

            {/* Submit OTP */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend OTP */}
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="mt-3 w-full text-[#7B3931] font-semibold hover:underline"
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* ========================== MESSAGE ========================== */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-4 text-center text-gray-600 text-sm sm:text-base flex justify-center gap-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#7B3931] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
