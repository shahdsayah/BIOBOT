import { getToken, apiFetch } from "./authService";

const API_URL = "http://localhost:3000/api/forms";

function authOnlyHeader() {
  const token = getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getForms() {
  const response = await apiFetch(API_URL, {
    headers: authOnlyHeader(),
  });

  if (!response.ok) {
    throw new Error("Failed to load forms");
  }

  return response.json();
}

export async function createForm(formData) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    headers: authOnlyHeader(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create form");
  }

  return response.json();
}

export async function updateForm(id, updatedFields) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authOnlyHeader(),
    },
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update form");
  }

  return response.json();
}

export async function deleteForm(id) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authOnlyHeader(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete form");
  }

  return response.json();
}