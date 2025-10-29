import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://projectmanagement-backend.up.railway.app/api/users/profile", {
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
        "https://projectmanagement-backend.up.railway.app/api/auth/login",
        formData,
        {withCredentials:true}
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
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#7B3931]"
          required
        />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
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
                        className={`mt-4 text-center ${message.includes("✅") ? "text-green-600" : "text-red-600"
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
