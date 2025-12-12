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
    setMessage("");

    try {
      const data = await loginUser(formData);

      // Extract username
      const username =
        data.username ||
        data.user?.username ||
        formData.email.split("@")[0];

      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      window.dispatchEvent(new Event("login"));

      setMessage("✅ Login successful! Redirecting...");

      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setMessage("❌ " + (err.message || "Login failed"));
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08111e] via-[#0b1628] to-[#101a2e] text-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-[340px] p-6 rounded-2xl shadow-lg text-center"
      >
        <h1 className="text-2xl font-semibold text-cyan-400 mb-2">🔐 Login</h1>
        <p className="text-gray-400 text-xs mb-5">
          Sign in to continue your RailMate journey
        </p>

        <form onSubmit={handleLogin} className="space-y-3 text-left">
          {/* Email */}
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

          {/* Password */}
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

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="btn-glow w-full py-2 text-sm font-semibold"
          >
            Login
          </motion.button>
        </form>

        {message && (
          <p className="text-cyan-300 text-sm mt-3 transition-all">
            {message}
          </p>
        )}

       <div className="mt-5 text-center">
  <p className="text-gray-400 text-xs mb-2">Don’t have an account?</p>

  <Link to="/register" className="block">
    <button className="btn-glow w-full py-2 text-sm font-semibold">
      Register
    </button>
  </Link>
</div>

      </motion.div>
    </section>
  );
};

export default Login;
