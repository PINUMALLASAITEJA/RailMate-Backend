import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Load username on load
  useEffect(() => {
    setUsername(localStorage.getItem("username") || null);
  }, []);

  // 🔹 Listen for login/logout events
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

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/home" className="logo">
        🚆 RailMate
      </Link>

      {/* NAV LINKS */}
      <ul className="nav-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/book">Book</Link>
        </li>
        <li>
          <Link to="/myjourneys">My Journeys</Link>
        </li>

        {/* USER DROPDOWN */}
        {username ? (
          <li className="profile-dropdown" ref={dropdownRef}>
            {/* Username Button */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="profile-btn"
            >
              {username}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/profile")}>
                  👤 View Profile
                </button>
                <button onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link to="/login" className="btn-glow">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
