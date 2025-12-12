import React, { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../api/railmateAPI";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict username characters
    if (name === "username") {
      const regex = /^[a-z0-9_]*$/;
      if (!regex.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await registerUser(formData);

      setMessage("✅ Registration successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage("❌ " + error.message);
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
        <h1 className="text-2xl font-semibold text-cyan-400 mb-2">
          🧾 Create Your Account
        </h1>
        <p className="text-gray-400 text-xs mb-5">
          Join RailMate — start your AI-powered journey today
        </p>

        <form onSubmit={handleRegister} className="space-y-3 text-left">
          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username (a-z, 0-9, _)"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="15"
              className="input"
            />
          </div>

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
              minLength="6"
              className="input"
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="btn-glow w-full py-2 text-sm font-semibold"
          >
            Register
          </motion.button>
        </form>

        {message && (
          <p className="text-cyan-300 text-sm mt-3 transition-all">
            {message}
          </p>
        )}

        <p className="text-gray-400 text-xs mt-5">
          Already have an account?{" "}
          <Link to="/login" className="nav-btn">
  Login
</Link>

        </p>
      </motion.div>
    </section>
  );
};

export default Register;
