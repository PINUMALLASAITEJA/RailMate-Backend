// src/api/railmateAPI.js

// 🌍 Auto-detect backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://rail-mate-backend.vercel.app/";  // backend URL

// 🚆 Fetch trains
export const getTrains = async () => {
  const res = await fetch(`${API_URL}/trains`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch trains");
  return await res.json();
};

// 🎫 Book ticket
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
export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Registration failed");
  }

  return await res.json();
}

// 🔑 Login
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }

  return await res.json();
}

// 👤 Profile
export async function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/auth/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch profile");
  }

  return await res.json();
}
