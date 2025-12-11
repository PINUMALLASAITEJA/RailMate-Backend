import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../api/railmateAPI";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);
      const username =
        data.username || formData.email.split("@")[0];

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      window.dispatchEvent(new Event("login"));
      setMessage("✅ Login Successful!");

      setTimeout(() => navigate("/home"), 500);
    } catch (err) {
      setMessage("❌ " + (err.message || "Login failed"));
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#08111e] text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-[340px] p-6 rounded-2xl shadow-lg text-center"
      >
        <h1 className="text-2xl font-semibold text-cyan-400 mb-1">🔐 Login</h1>

        <form onSubmit={handleLogin} className="space-y-3 text-left">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="btn-glow w-full"
          >
            Login
          </motion.button>
        </form>

        {message && (
          <p className="text-cyan-300 text-sm mt-3">{message}</p>
        )}

        <p className="text-gray-400 text-xs mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 underline">
            Register
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;
