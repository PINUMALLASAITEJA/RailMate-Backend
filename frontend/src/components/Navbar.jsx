import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";   // ✅ important — restores your styling

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Always refresh username when route changes
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="navbar"> {/* uses Navbar.css */}
      <div className="logo" onClick={() => navigate("/home")}>
        🚆 <span>RailMate</span>
      </div>

      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/book">Book</Link></li>
        <li><Link to="/myjourneys">My Journeys</Link></li>

        {username ? (
          <li className="profile-dropdown">
            <button className="profile-btn">{username}</button>
            <div className="dropdown-menu">
              <button onClick={() => navigate("/profile")}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </li>
        ) : (
          <li>
            <Link to="/login" className="btn-login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
