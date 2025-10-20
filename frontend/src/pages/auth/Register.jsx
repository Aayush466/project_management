import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState("register"); // "register" | "verify"
  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    userpassword: "",
    role: "",
  });
  const [otp, setOtp] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = {};
      data["username"] =formData["username"];
      data["useremail"] =formData["useremail"];
      data["userpassword"]=formData["userpassword"];
      data["role"]=formData["role"];

      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setMessage(
        "✅ Registration successful! Please check your email for OTP."
      );
      setStep("verify");
    } catch (error) {
      console.error("Axios Error:", error);
      if (error.response) {
        setMessage(
          `❌ ${error.response.data?.message || "Registration failed"}`
        );
      } else {
        setMessage("❌ Network or server error. Please try again.");
      }
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
        "http://localhost:8000/api/v1/users/submit-otp",
        {
          useremail: formData.useremail,
          userpassword: formData.userpassword,
          otp
        },
      );

      setMessage("✅ User verified successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard"; // redirect
      }, 2000);
    } catch (error) {
      console.error("OTP Error:", error);
      if (error.response) {
        setMessage(
          `❌ ${error.response.data?.message || "OTP verification failed"}`
        );
      } else {
        setMessage("❌ Network or server error. Please try again.");
      }
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

            {/* Role */}
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#7B3931]"
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>


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
         <p
            className="mt-4 text-center text-gray-600 text-sm sm:text-base flex justify-center gap-2"
          >Already have an account?{" "}
            <Link to="/login" className="text-[#7B3931] font-semibold hover:underline">Login</Link>
          </p>
      </div>
    </div>
  );
};

export default Register;
