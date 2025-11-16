import React from "react";
import { motion } from "framer-motion";
import { Train, Cpu, Users, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Train size={36} className="text-cyan-400" />,
      title: "Smart Seat Allocation",
      desc: "Automatically assigns seats efficiently using intelligent algorithms to minimize vacant spots.",
    },
    {
      icon: <Cpu size={36} className="text-purple-400" />,
      title: "AI-Powered System",
      desc: "RailMate uses AI logic to predict seat availability and optimize passenger comfort.",
    },
    {
      icon: <Users size={36} className="text-pink-400" />,
      title: "User-Friendly Experience",
      desc: "A modern, minimal interface that makes train booking fast, simple, and secure.",
    },
    {
      icon: <Zap size={36} className="text-yellow-400" />,
      title: "Lightning Fast Performance",
      desc: "Built with modern frameworks like React & Tailwind for instant responsiveness.",
    },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-10">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-extrabold text-cyan-400 mb-4"
      >
        About RailMate 🚆
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-2xl text-center text-gray-300 mb-12 leading-relaxed"
      >
        RailMate is your intelligent companion for railway seat booking. It leverages smart allocation algorithms to
        ensure every seat is optimally used — reducing waiting lists and enhancing travel efficiency.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg hover:shadow-cyan-500/30 transition-all text-center"
          >
            <div className="flex justify-center mb-3">{f.icon}</div>
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        viewport={{ once: true }}
        className="mt-12 bg-white/10 p-6 rounded-2xl border border-cyan-400/30 text-center max-w-lg"
      >
        <p className="text-gray-200 italic">
          “RailMate is not just a booking tool — it’s the next generation of smart railway systems.” 💡
        </p>
      </motion.div>
    </section>
  );
};

export default About;
