import React, { useEffect, useState } from "react";
import { getProfile } from "../api/railmateAPI";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await getProfile(token);
        if (res.user && res.user.email) {
          setUser(res.user);
        } else if (res.email) {
          setUser(res);
        } else {
          sessionStorage.clear();
          navigate("/login");
        }
      } catch {
        sessionStorage.clear();
        navigate("/login");
      }
    })();
  }, [navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08111e] via-[#0b1628] to-[#101a2e] text-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-[340px] p-6 rounded-2xl shadow-lg text-center"
      >
        {/* 🔹 Header */}
        <h1 className="text-2xl font-semibold text-cyan-400 mb-1">
          👤 My Profile
        </h1>
        <p className="text-gray-400 text-xs mb-5">
          View your RailMate account details
        </p>

        {/* 🔹 Profile Info */}
        {user ? (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="bg-cyan-500/15 border border-cyan-400/30 p-4 rounded-full shadow-inner">
              <span className="text-4xl">🧳</span>
            </div>

            {/* Clean info text only */}
            <div className="text-sm space-y-2 text-gray-200">
              <p>
                <strong className="text-cyan-300">Username:</strong>{" "}
                {user.username || sessionStorage.getItem("username")}
              </p>
              <p>
                <strong className="text-cyan-300">Email:</strong> {user.email}
              </p>
            </div>

            {/* 🔹 Logout Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sessionStorage.clear();
                navigate("/login");
              }}
              className="btn-nav mt-4"
            >
              🚪 Logout
            </motion.button>
          </motion.div>
        ) : (
          <p className="text-gray-400 text-sm">⏳ Loading profile...</p>
        )}
      </motion.div>
    </section>
  );
};

export default Profile;
