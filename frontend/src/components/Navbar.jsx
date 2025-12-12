import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/home")}>
        🚆 <span>RailMate</span>
      </div>

      <ul className="nav-links">
        <li>
          <Link
            to="/home"
            className={`btn-glow-small ${
              location.pathname === "/home" ? "active-link" : ""
            }`}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/book"
            className={`btn-glow-small ${
              location.pathname === "/book" ? "active-link" : ""
            }`}
          >
            Book
          </Link>
        </li>

        <li>
          <Link
            to="/myjourneys"
            className={`btn-glow-small ${
              location.pathname === "/myjourneys" ? "active-link" : ""
            }`}
          >
            My Journeys
          </Link>
        </li>

        {username ? (
          <li className="profile-dropdown">
            <button
              className="btn-glow-small profile-btn"
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
          <li>
            <Link to="/login" className="btn-glow-small">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
