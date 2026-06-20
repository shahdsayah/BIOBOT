/* Authentication Service Layer:
   bridge between user interface
   and backend server database
*/

const API_URL = "http://localhost:3000/api/users";

// Register new user
export async function registerUser(user) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Register failed");
  }

  return response.json();
}

// Login user
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await response.json();

  const user = data.user ? data.user : data;

  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

// Logout user
export function logoutUser() {
  localStorage.removeItem("user");
}

// Get current logged-in user
export function getCurrentUser() {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

// Get all users from DB
export async function getUsers() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  return response.json();
}

// Get one user by ID from DB
export async function getUserById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load user");
  }

  return response.json();
}

// Update user by ID
export async function updateUser(id, updatedData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
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
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete user");
  }

  return response.json();
}