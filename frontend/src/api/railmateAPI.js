// src/api/railmateAPI.js

// Normalize backend URL
const RAW_URL =
  import.meta.env.VITE_API_URL ||
  "https://rail-mate-backend.vercel.app";

const API_URL = RAW_URL.replace(/\/+$/, ""); // remove trailing slashes

console.log("🔗 RailMate API:", API_URL);

// =========================
// 🚆 Fetch Trains
// =========================
export async function getTrains() {
  const res = await fetch(`${API_URL}/trains`);
  if (!res.ok) throw new Error("Failed to fetch trains");
  return res.json();
}

// =========================
// 🎫 Book Ticket
// =========================
export async function bookTicket(data) {
  const res = await fetch(`${API_URL}/book_ticket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({ error: "Booking failed" }));

  if (!res.ok) throw new Error(json.error);
  return json;
}

// =========================
// 🧾 Register user
// =========================
export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const json = await res.json().catch(() => ({ error: "Registration failed" }));

  if (!res.ok) throw new Error(json.error);
  return json;
}

// =========================
// 🔑 Login user
// =========================
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const json = await res.json().catch(() => ({ error: "Login failed" }));

  if (!res.ok) throw new Error(json.error);
  return json;
}

// =========================
// 👤 Get Profile
// =========================
export async function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token stored");

  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json().catch(() => ({ error: "Profile error" }));

  if (!res.ok) throw new Error(json.error);
  return json;
}
