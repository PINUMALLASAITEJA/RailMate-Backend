import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser);
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/home")}>
        🚆 RailMate
      </div>

      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/book">Book</Link></li>
        <li><Link to="/myjourneys">My Journeys</Link></li>

        {username ? (
          <li className="profile-dropdown">
            <button className="profile-btn" onClick={() => setOpen(!open)}>
              {username}
            </button>

            {open && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/profile")}>View Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link to="/login" className="btn-shine">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
