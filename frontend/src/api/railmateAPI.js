// src/api/railmateAPI.js

// Force backend URL correctly
let API_URL = import.meta.env.VITE_API_URL;

// If build failed to load VITE_API_URL → force production backend
if (!API_URL || API_URL.includes("127.0.0.1") || API_URL.includes("localhost")) {
  API_URL = "https://rail-mate-backend.vercel.app";
}

// Remove trailing slash
API_URL = API_URL.replace(/\/+$/, "");

console.log("🔗 RailMate API:", API_URL);

// Fetch Trains
export const getTrains = async () => {
  const res = await fetch(`${API_URL}/trains`);
  if (!res.ok) throw new Error("Failed to fetch trains");
  return await res.json();
};

// Register
export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json().catch(() => ({ error: "Registration failed" }));

  if (!res.ok) throw new Error(data.error);
  return data;
}

// Login
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json().catch(() => ({ error: "Login failed" }));

  if (!res.ok) throw new Error(data.error);
  return data;
}

// Profile
export async function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token stored");

  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({ error: "Profile error" }));

  if (!res.ok) throw new Error(data.error);
  return data;
}
