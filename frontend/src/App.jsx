import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyJourneys from "./pages/MyJourneys";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./styles/Global.css";

// 📌 Private Route Component
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Automatically redirect "/" -> "/login" if no token
const RedirectHandler = () => {
  const token = sessionStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* 🔐 Protected Home Page */}
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

            {/* Protected routes */}
            <Route path="/book" element={<PrivateRoute><Booking /></PrivateRoute>} />
            <Route path="/myjourneys" element={<PrivateRoute><MyJourneys /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Default route */}
            <Route path="*" element={<RedirectHandler />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
