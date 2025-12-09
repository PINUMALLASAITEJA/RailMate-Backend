// src/api/railmateAPI.js

const RAW_URL =
  import.meta.env.VITE_API_URL ||
  "https://rail-mate-backend.vercel.app";

const API_URL = RAW_URL.replace(/\/+$/, ""); 

console.log("🔗 RailMate API:", API_URL);

// REGISTER
export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Registration failed");
  }
  return data;
}

// LOGIN
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Login failed");
  }
  return data;
}

// PROFILE
export async function getProfile() {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Profile fetch failed");
  }

  return data;
}

// TRAINS
export const getTrains = async () => {
  const res = await fetch(`${API_URL}/trains`);
  const data = await res.json();
  return data;
};
