import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // keep username synced with localStorage (on route change)
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, [location.pathname]);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setOpenDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="logo" onClick={() => navigate("/home")} tabIndex={0}>
        🚆 <span>RailMate</span>
      </div>

      <ul className="nav-links" role="menubar">
        <li role="none">
          <Link
            to="/home"
            role="menuitem"
            className={`nav-btn ${location.pathname === "/home" ? "active-link" : ""}`}
          >
            Home
          </Link>
        </li>

        <li role="none">
          <Link
            to="/book"
            role="menuitem"
            className={`nav-btn ${location.pathname === "/book" ? "active-link" : ""}`}
          >
            Book
          </Link>
        </li>

        <li role="none">
          <Link
            to="/myjourneys"
            role="menuitem"
            className={`nav-btn ${location.pathname === "/myjourneys" ? "active-link" : ""}`}
          >
            My Journeys
          </Link>
        </li>

        {username ? (
          <li
            className={`profile-dropdown ${openDropdown ? "open" : ""}`}
            ref={dropdownRef}
            role="none"
          >
            <button
              className="profile-btn"
              onClick={() => setOpenDropdown((s) => !s)}
              aria-haspopup="true"
              aria-expanded={openDropdown}
            >
              {username}
              <span className="caret" aria-hidden="true">▾</span>
            </button>

            <div className="dropdown-menu" role="menu" aria-label="Profile menu">
              <button role="menuitem" onClick={() => { setOpenDropdown(false); navigate("/profile"); }}>
                View Profile
              </button>
              <button role="menuitem" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </li>
        ) : (
          <li role="none">
            <Link to="/login" className="nav-btn" role="menuitem">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
