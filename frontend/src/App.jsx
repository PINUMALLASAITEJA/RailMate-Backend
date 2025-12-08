import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyJourneys from "./pages/MyJourneys";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";

import "./styles/Global.css";

// 🔒 Route protection component
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>

            {/* 🌍 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* 🔐 Protected Routes */}
            <Route path="/book" element={<PrivateRoute><Booking /></PrivateRoute>} />
            <Route path="/myjourneys" element={<PrivateRoute><MyJourneys /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

            {/* Unknown route fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
