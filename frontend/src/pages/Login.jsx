import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../api/railmateAPI";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      if (data.token) {
        // Store token & username
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "username",
          data.username || formData.email.split("@")[0]
        );

        // 🔥 Trigger navbar update immediately
        window.dispatchEvent(new Event("login"));

        setMessage("✅ Login Successful!");

        setTimeout(() => navigate("/home"), 500);
      } else {
        setMessage("❌ Invalid Credentials");
      }
    } catch (err) {
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
              className="input"
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
              className="input"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="btn-glow w-full"
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
