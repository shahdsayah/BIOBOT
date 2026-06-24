/* Authentication Service Layer:
   bridge between user interface
   and backend server database
*/

import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/users`;

// Safely parse JSON, return null if body is empty
async function safeJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Register new user
export async function registerUser(user) {
  const response = await apiFetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(error?.message || "Register failed");
  }

  return response.json();
}

// Login user
export async function loginUser(email, password) {
  const response = await apiFetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(error?.message || "Login failed");
  }

  const data = await response.json();

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data.user;
}

// Logout user
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Get current logged-in user
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Get the stored JWT token
export function getToken() {
  return localStorage.getItem("token");
}

// Returns headers with Authorization token for authenticated requests
export function authHeaders(extra = {}) {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

// Drop-in replacement for fetch that handles expired/invalid tokens globally
export async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  return response;
}

// Get all users from DB
export async function getUsers() {
  const response = await apiFetch(API_URL, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  return response.json();
}

// Get one user by ID from DB
export async function getUserById(id) {
  const response = await apiFetch(`${API_URL}/${id}`, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error("Failed to load user");
  }

  return response.json();
}

// Update user by ID
export async function updateUser(id, updatedData) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update user");
  }

  return response.json();
}

// Delete user by ID
export async function deleteUser(id) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete user");
  }

  return response.json();
}