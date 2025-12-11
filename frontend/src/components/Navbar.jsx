import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load username when route changes
  useEffect(() => {
    setUsername(localStorage.getItem("username") || null);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
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
      <div className="logo" onClick={() => navigate("/home")}>
        🚆 <span>RailMate</span>
      </div>

      {/* Navigation */}
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

        {/* Logged-in user dropdown */}
        {username ? (
          <li className="profile-dropdown" ref={menuRef}>
            <button
              className="profile-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {username}
            </button>

            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/profile")}>View Profile</button>
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
