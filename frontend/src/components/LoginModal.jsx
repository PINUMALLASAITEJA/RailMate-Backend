import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../api/railmateAPI";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      if (data.token) {
        localStorage.setItem("token", data.token);
        const username = formData.email.split("@")[0];
        localStorage.setItem("username", username);
        setMessage("✅ Login Successful!");
        setTimeout(() => {
          onLoginSuccess(username);
          onClose();
        }, 800);
      } else {
        setMessage("❌ Invalid credentials");
      }
    } catch {
      setMessage("⚠️ Login failed. Try again later.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[9999]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // prevent close on box click
        className="login-modal-box relative p-6 w-[90%] max-w-md text-center rounded-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">🔐 Login</h2>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full p-2 bg-transparent border border-cyan-500 rounded-md text-white text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="w-full p-2 bg-transparent border border-cyan-500 rounded-md text-white text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full bg-cyan-500 py-2 rounded-md font-semibold text-white hover:bg-cyan-600 transition-all"
          >
            Login
          </motion.button>
        </form>

        {message && <p className="text-cyan-300 text-sm mt-3">{message}</p>}
      </motion.div>
    </div>
  );
};

export default LoginModal;
