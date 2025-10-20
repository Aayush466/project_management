import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    useremail: "",
    userpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        formData,
        { withCredentials: true }
      );

      console.log("Login Response:", response.data);

      // Save user info and token if needed
      const user = response.data.user || {};
      const token = response.data.token || "";

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      setMessage("✅ Login successful! Redirecting...");

      // Redirect to dashboard or home page
      setTimeout(() => {
        navigate("/dashboard"); // change as per your route
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error.response || error.message);
      setMessage(
        error.response?.data?.message || "❌ Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full sm:w-96 border"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#7B3931]">
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={formData.useremail}
          onChange={(e) => setFormData({ ...formData, useremail: e.target.value })}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7B3931] text-white py-3 rounded-lg hover:bg-[#622d26] disabled:opacity-50 transition"
        >
          {loading ? "Processing..." : "Login"}
        </button>

        {/* Registration Link */}
        <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
          Don't have an account?{" "}
          <Link to="/" className="text-[#7B3931] font-semibold hover:underline">
            Register
          </Link>
        </p>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;