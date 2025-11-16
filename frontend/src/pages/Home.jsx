import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <section className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#08111e] via-[#0b1628] to-[#101a2e] relative overflow-hidden">
      <div className="absolute inset-0 animate-aurora bg-[radial-gradient(circle_at_20%_30%,_rgba(0,226,255,0.2),_transparent_70%)]"></div>
      <div className="absolute inset-0 animate-aurora2 bg-[radial-gradient(circle_at_80%_70%,_rgba(123,97,255,0.2),_transparent_70%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card text-center w-full max-w-lg p-8 z-10"
      >
        <h1 className="text-4xl font-bold text-cyan-300 mb-4">
          Welcome to <span className="text-cyan-100">RailMate 🚆</span>
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
