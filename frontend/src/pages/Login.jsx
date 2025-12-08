import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../api/railmateAPI";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🚀 Redirect if token already exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/book");  // Go to booking page directly
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);

      if (data.token) {
        // Save JWT & username to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "username",
          data.username || formData.email.split("@")[0]
        );

        setMessage("✅ Login Successful!");

        setTimeout(() => {
          navigate("/book"); // Redirect to booking page
        }, 500);
      } else {
        setMessage("❌ Invalid Credentials");
      }
    } catch (error) {
      setMessage("⚠️ Login failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08111e] via-[#0b1628] to-[#101a2e] text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-[340px] p-6 rounded-2xl shadow-lg text-center"
      >
        <h1 className="text-2xl font-semibold text-cyan-400 mb-1">🔐 Login</h1>
        <p className="text-gray-400 text-xs mb-5">
          Sign in to continue your RailMate journey
        </p>

        <form onSubmit={handleLogin} className="space-y-3 text-left">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-cyan-400/40 rounded-md p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-cyan-400/40 rounded-md p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded-md font-semibold text-white transition-all text-sm"
          >
            Login
          </motion.button>
        </form>

        {message && (
          <p className="text-cyan-300 text-sm mt-3 transition-all">{message}</p>
        )}

        <p className="text-gray-400 text-xs mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;