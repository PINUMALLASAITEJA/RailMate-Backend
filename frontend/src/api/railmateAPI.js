// src/api/railmateAPI.js

// 🛑 Hard-protect API URL during production builds
let API_URL = import.meta.env.VITE_API_URL;

// If VITE_API_URL is missing or empty → force correct backend
if (!API_URL || API_URL.trim() === "" || API_URL.includes("localhost")) {
  API_URL = "https://rail-mate-backend.vercel.app";
}

// Remove trailing slash if exists
API_URL = API_URL.replace(/\/+$/, "");

console.log("🔗 RailMate API:", API_URL);

// -------------------------------
// 🚆 Fetch Trains
// -------------------------------
export const getTrains = async () => {
  const res = await fetch(`${API_URL}/trains`);
  if (!res.ok) throw new Error("Failed to fetch trains");
  return await res.json();
};

// -------------------------------
// 🎫 Book Ticket
// -------------------------------
export const bookTicket = async (data) => {
  const res = await fetch(`${API_URL}/book_ticket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Booking failed" }));
    throw new Error(err.error);
  }

  return await res.json();
};

// -------------------------------
// 🧾 Register User
// -------------------------------
export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Registration failed" }));
    throw new Error(err.error);
  }

  return await res.json();
}

// -------------------------------
// 🔑 Login User
// -------------------------------
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Login failed" }));
    throw new Error(err.error);
  }

  return await res.json();
}

// -------------------------------
// 👤 Fetch Profile
// -------------------------------
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
