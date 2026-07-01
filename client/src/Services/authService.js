/** @file Handles all user authentication: register, login, logout, token storage, and user CRUD calls. */

import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/users`;

/** Safely parses a JSON response body — returns null if the body is empty or not valid JSON. */
async function safeJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Registers a new student account. @param {object} user - Registration fields (firstName, lastName, email, password, semester). */
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

/** Logs in and stores the JWT token and user object in localStorage. @returns {object} The logged-in user. */
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

/** Clears the JWT token and user data from localStorage. */
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/** Returns the current user from localStorage, or null if not logged in. */
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/** Returns the stored JWT token, or null if the user is not authenticated. */
export function getToken() {
  return localStorage.getItem("token");
}

/** Builds request headers including the Authorization Bearer token. @param {object} extra - Additional headers to merge in. */
export function authHeaders(extra = {}) {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/** Wrapper around fetch that auto-redirects to /login on 401 responses. */
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

/** Fetches all users (admin only). */
export async function getUsers() {
  const response = await apiFetch(API_URL, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  return response.json();
}

/** Fetches a single user by MongoDB ID. */
export async function getUserById(id) {
  const response = await apiFetch(`${API_URL}/${id}`, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error("Failed to load user");
  }

  return response.json();
}

/** Updates a user's fields by ID. @param {object} updatedData - Fields to update (e.g. role). */
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

/** Deletes a user by ID (admin only). */
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