/** @file Admin-facing form CRUD: create, search, update, and delete uploaded forms. */

import { authHeaders, apiFetch } from "./authService";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/forms`;

/** Fetches all forms, optionally filtered by a search keyword. @param {string} search - Optional search query. */
export async function getForms(search = "") {
  const url = search
    ? `${API_URL}?search=${encodeURIComponent(search)}`
    : API_URL;

  const response = await apiFetch(url, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load forms");
  }

  return response.json();
}

/** Uploads a new form (multipart FormData with file + metadata). */
export async function createForm(formData) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create form");
  }

  return response.json();
}

/** Updates a form's title or description by ID. @param {object} updatedFields - Fields to change. */
export async function updateForm(id, updatedFields) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update form");
  }

  return response.json();
}

/** Deletes a form and its uploaded file by ID. */
export async function deleteForm(id) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete form");
  }

  return response.json();
}