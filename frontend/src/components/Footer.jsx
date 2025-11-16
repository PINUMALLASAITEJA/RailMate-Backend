import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-[#0d1117] text-gray-300 border-t border-gray-800">
      {/* ======= Top Horizontal Section ======= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto flex flex-wrap justify-between items-start px-6 py-10 gap-10"
      >
        {/* Column 1 */}
        <div className="min-w-[180px] flex-1">
          <h3 className="text-white font-semibold mb-3 text-lg">
            🚆 Get to Know RailMate
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-cyan-400 cursor-pointer transition-all">About Us</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Careers</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Press Releases</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Blog</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="min-w-[180px] flex-1">
          <h3 className="text-white font-semibold mb-3 text-lg">
            🌐 Connect with Us
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Facebook</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Twitter</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">LinkedIn</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Instagram</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="min-w-[180px] flex-1">
          <h3 className="text-white font-semibold mb-3 text-lg">
            💼 Partner with RailMate
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Become a Partner</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Advertise with Us</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">RailMate for Business</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">AI Integration Program</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="min-w-[180px] flex-1">
          <h3 className="text-white font-semibold mb-3 text-lg">
            🛠️ Let Us Help You
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Your Account</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Booking Support</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Cancel Ticket</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-all">Help Center</li>
          </ul>
        </div>
      </motion.div>

      {/* ======= Bottom Bar ======= */}
      <div className="bg-[#090c10] border-t border-gray-800 py-4 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="text-cyan-400 font-medium">RailMate</span> — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
