import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // Load username when page loads
  useEffect(() => {
    setUsername(localStorage.getItem("username") || null);
  }, []);

  // Automatically update navbar whenever login/logout happens
  useEffect(() => {
    const updateUser = () => {
      setUsername(localStorage.getItem("username") || null);
    };

    window.addEventListener("storage", updateUser);
    window.addEventListener("login", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("login", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);

    // 🔥 Trigger UI update
    window.dispatchEvent(new Event("storage"));

    navigate("/login");
  };

  return (
    <nav className="w-full bg-[#0b1628]/80 backdrop-blur-lg text-white px-6 py-3 flex justify-between items-center shadow-lg">
      
      {/* Logo */}
      <Link to="/home" className="text-xl font-semibold text-cyan-400 tracking-wide">
        🚆 RailMate
      </Link>

      {/* Navigation Options */}
      <div className="flex items-center gap-6 text-sm">

        <Link to="/home" className="hover:text-cyan-400">Home</Link>
        <Link to="/book" className="hover:text-cyan-400">Book</Link>
        <Link to="/myjourneys" className="hover:text-cyan-400">My Journeys</Link>

        {/* 🔥 Logged-in UI */}
        {username ? (
          <div className="flex items-center gap-4">

            <Link
              to="/profile"
              className="px-3 py-1 rounded-md bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30"
            >
              {username}
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md bg-red-500/20 border border-red-400/30 hover:bg-red-500/30"
            >
              Logout
            </button>

          </div>
        ) : (
          // 🔥 Not logged in → show Login button
          <Link
            to="/login"
            className="px-3 py-1 rounded-md bg-cyan-500 hover:bg-cyan-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
