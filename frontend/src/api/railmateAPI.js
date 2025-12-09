// src/api/railmateAPI.js

// Normalize backend URL
const RAW_URL =
  import.meta.env.VITE_API_URL ||
  "https://rail-mate-backend.vercel.app";

const API_URL = RAW_URL.replace(/\/+$/, ""); // remove trailing slashes

console.log("🔗 RailMate API:", API_URL);

// Fetch Trains
export const getTrains = async () => {
  const res = await fetch(`${API_URL}/trains`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch trains");
  return await res.json();
};

// Book Ticket
export const bookTicket = async (data) => {
  const res = await fetch(`${API_URL}/book_ticket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Booking failed" }));
    throw new Error(err.error);
  }
  return await res.json();
};

// Register
export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Registration failed" }));
    throw new Error(err.error);
  }

  return await res.json();
}

// Login
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Login failed" }));
    throw new Error(err.error);
  }

  return await res.json();
}

// Get Profile
export async function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token stored");

  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Profile error" }));
    throw new Error(err.error);
  }

  return await res.json();
}
