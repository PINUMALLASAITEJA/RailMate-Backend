import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // ✅ Initial check
    const storedUser = sessionStorage.getItem("username");
    if (storedUser) setUsername(storedUser);

    // ✅ React instantly when user logs in or logs out
    const handleLoginChange = () => {
      const updatedUser = sessionStorage.getItem("username");
      setUsername(updatedUser || "");
    };

    window.addEventListener("login", handleLoginChange);
    window.addEventListener("storage", handleLoginChange);

    return () => {
      window.removeEventListener("login", handleLoginChange);
      window.removeEventListener("storage", handleLoginChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUsername("");
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        🚆 <span>RailMate</span>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/book"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Book Tickets
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/myjourneys"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            My Journeys
          </NavLink>
        </li>

        {/* 👤 Profile Section */}
        {username ? (
          <li className="profile-dropdown">
            <button
              className="profile-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              👤 {username}
            </button>

            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/profile")}>
                  View Profile
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <li>
            <button
              className="btn-glow text-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
