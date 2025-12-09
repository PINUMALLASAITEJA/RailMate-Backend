// src/api/railmateAPI.js

// Normalize backend URL
const RAW_URL =
  import.meta.env.VITE_API_URL ||
  "https://rail-mate-backend.vercel.app";

export const API_URL = RAW_URL.replace(/\/+$/, "");

console.log("🔗 RailMate API:", API_URL);

// 🚆 Fetch trains
export const getTrains = async () => {
  const res = await fetch(`${API_URL}/trains`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch trains");
  return await res.json();
};

// 🎫 Book Ticket
export const bookTicket = async (data) => {
  const res = await fetch(`${API_URL}/book_ticket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Booking failed");
  return await res.json();
};

// 🧾 Register
export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Registration failed" }));
    throw new Error(err.error || "Registration failed");
  }

  return await res.json();
};

// 🔑 Login
export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Login failed" }));
    throw new Error(err.error || "Login failed");
  }

  return await res.json();
};

// 👤 Profile
export const getProfile = async () => {
  const token = sessionStorage.getItem("token"); // FIXED
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/auth/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Profile fetch failed" }));
    throw new Error(err.error || "Failed to fetch profile");
  }

  return await res.json();
};
