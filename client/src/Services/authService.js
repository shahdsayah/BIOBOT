
/*Authentication Service Layer:
bridge between user interface,
and backend server database
*/

//base URL:
const API_URL = "http://localhost:3000/api/users";

//Registers a new user account with the backend server
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

//Authenticates user credentials with the backend
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
    throw new Error(error.message);
  }

  const user = await response.json();

  // Persist the user session in the browser memory
  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

//Terminates the active user session by clearing authentication tokens
export function logoutUser() {
  localStorage.removeItem("user");
}

//Retrieves and reconstructs the active user session data
export function getCurrentUser() {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

export async function getUsers() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  return response.json();
}