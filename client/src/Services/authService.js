const API_URL = "http://localhost:3000/api/users";

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
    throw new Error(error.message);
  }

  return response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export function logoutUser() {
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}