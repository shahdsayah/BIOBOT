import { getToken } from "./authService";

const API_URL = "http://localhost:3000/api/forms";

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getForms() {
  const response = await fetch(API_URL, {
    headers: authHeader(),
  });

  if (!response.ok) {
    throw new Error("Failed to load forms");
  }

  return response.json();
}

export async function createForm(formData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create form");
  }

  return response.json();
}

export async function updateForm(id, updatedFields) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(updatedFields),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update form information");
  }

  return data;
}

export async function deleteForm(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete form");
  }

  return response.json();
}