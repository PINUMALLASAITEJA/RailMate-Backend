import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <section className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#08111e] via-[#0b1628] to-[#101a2e] relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute inset-0 animate-aurora bg-[radial-gradient(circle_at_20%_30%,_rgba(0,226,255,0.2),_transparent_70%)]"></div>
      <div className="absolute inset-0 animate-aurora2 bg-[radial-gradient(circle_at_80%_70%,_rgba(123,97,255,0.2),_transparent_70%)]"></div>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="home-card glass-card text-center z-10"
      >
        
        {/* 🚆 BIG FLOATING TRAIN ICON */}
        <div className="relative flex justify-center mb-4">
          <div className="absolute w-32 h-32 bg-cyan-400/10 blur-2xl rounded-full"></div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="text-15xl"
          >
            🚆
          </motion.div>
        </div>

        <h1 className="text-4xl font-bold text-cyan-300 mb-4">
          Welcome to <span className="text-cyan-100">RailMate</span>
        </h1>

        <p className="text-gray-300 text-base leading-relaxed">
          Your intelligent railway booking companion — designed with modern
          glassmorphism aesthetics, smooth performance, and real-time tracking.
        </p>

      </motion.div>
    </section>
  );
};

export default Home;
