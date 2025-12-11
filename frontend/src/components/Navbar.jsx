import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load username on route change
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, [location.pathname]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setOpenDropdown(false);
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
            className={`nav-btn ${
              location.pathname === "/home" ? "active-link" : ""
            }`}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/book"
            className={`nav-btn ${
              location.pathname === "/book" ? "active-link" : ""
            }`}
          >
            Book
          </Link>
        </li>

        <li>
          <Link
            to="/myjourneys"
            className={`nav-btn ${
              location.pathname === "/myjourneys" ? "active-link" : ""
            }`}
          >
            My Journeys
          </Link>
        </li>

        {/* Logged in → profile dropdown */}
        {username ? (
          <li
            className={`profile-dropdown ${openDropdown ? "open" : ""}`}
          >
            <button
              className="profile-btn"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {username}
            </button>

            <div className="dropdown-menu">
              <button onClick={() => navigate("/profile")}>
                View Profile
              </button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </li>
        ) : (
          <li>
            <Link to="/login" className="nav-btn">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
