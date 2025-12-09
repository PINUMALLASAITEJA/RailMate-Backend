import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("username");
      setUsername(updatedUser || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUsername("");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/home")}>
        🚆 <span>RailMate</span>
      </div>

      <ul className="nav-links">
        <li><NavLink to="/home" className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink></li>
        <li><NavLink to="/book" className={({ isActive }) => (isActive ? "active-link" : "")}>Book Tickets</NavLink></li>
        <li><NavLink to="/myjourneys" className={({ isActive }) => (isActive ? "active-link" : "")}>My Journeys</NavLink></li>

        {username ? (
          <li className="profile-dropdown">
            <button onClick={() => navigate("/profile")} className="profile-btn">
              👤 {username}
            </button>
            <button onClick={handleLogout} className="profile-btn">Logout</button>
          </li>
        ) : (
          <li>
            <button className="btn-glow" onClick={() => navigate("/login")}>Login</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
