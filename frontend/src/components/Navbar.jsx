import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  // Load username when route changes OR when login updates
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/home")}>
        🚆 <span>RailMate</span>
      </div>

      <ul className="nav-links">
        <li>
          <Link
            to="/home"
            className={location.pathname === "/home" ? "active-link" : ""}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/book"
            className={location.pathname === "/book" ? "active-link" : ""}
          >
            Book
          </Link>
        </li>

        <li>
          <Link
            to="/myjourneys"
            className={location.pathname === "/myjourneys" ? "active-link" : ""}
          >
            My Journeys
          </Link>
        </li>

        {/* If logged in → username button + dropdown */}
        {username ? (
          <li className="profile-dropdown" ref={dropdownRef}>
            
            {/* Username Button */}
            <button
              className="profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {username}
            </button>

            {/* Dropdown (only visible when dropdownOpen = true) */}
            {dropdownOpen && (
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
