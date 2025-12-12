import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <section className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#08111e] via-[#0b1628] to-[#101a2e] relative overflow-hidden">

      {/* 🔵 Background Aurora Layers */}
      <div className="absolute inset-0 animate-aurora bg-[radial-gradient(circle_at_20%_30%,_rgba(0,226,255,0.17),_transparent_70%)]"></div>
      <div className="absolute inset-0 animate-aurora2 bg-[radial-gradient(circle_at_80%_70%,_rgba(123,97,255,0.17),_transparent_70%)]"></div>

      {/* 🌟 Main Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="home-card glass-card text-center relative overflow-hidden"
      >
        {/* 🔥 Floating Train Icon */}
        <motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
  className="text-8xl mb-5"
>
  🚆
</motion.div>


        {/* Heading */}
        <h1 className="text-4xl font-bold text-cyan-300 mb-3 leading-tight">
          Welcome to <br />
          <span className="text-cyan-100">RailMate</span>
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
          Your intelligent railway booking companion — crafted with modern
          glassmorphism aesthetics, smooth animations, optimized performance,
          and real-time tracking for a next-gen travel experience.
        </p>

        {/* 🔹 Glow Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400/30 blur-sm"></div>
      </motion.div>
    </section>
  );
};

export default Home;
