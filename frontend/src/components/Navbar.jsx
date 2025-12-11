import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load username whenever route changes
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser);
  }, [location.pathname]);

  // Close dropdown on navigation
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

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

      {/* Navigation Links */}
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

        {/* If logged in */}
        {username ? (
          <li className="profile-dropdown">
            <button
              className="profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {username}
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/profile")}>View Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          // Login Button with shiny effect
          <li>
            <Link to="/login" className="btn-shine">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
