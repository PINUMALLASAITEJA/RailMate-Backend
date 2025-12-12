import React, { useEffect, useState } from "react";
import { getProfile } from "../api/railmateAPI";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await getProfile();
        if (res.user && res.user.email) {
          setUser(res.user);
        } else if (res.email) {
          setUser(res);
        } else {
          localStorage.clear();
          navigate("/login");
        }
      } catch {
        localStorage.clear();
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
        <h1 className="text-2xl font-semibold text-cyan-400 mb-1">
          👤 My Profile
        </h1>
        <p className="text-gray-400 text-xs mb-5">
          View your RailMate account details
        </p>

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

            <div className="text-sm space-y-2 text-gray-200">
              <p>
                <strong className="text-cyan-300">Username:</strong>{" "}
                {user.username || localStorage.getItem("username")}
              </p>
              <p>
                <strong className="text-cyan-300">Email:</strong> {user.email}
              </p>
            </div>

            {/* 🔥 Updated logout button styling */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                localStorage.clear();
                window.dispatchEvent(new Event("storage"));
                navigate("/login");
              }}
              className="nav-btn mt-4 px-6 py-2 text-sm"
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
