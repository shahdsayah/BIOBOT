/** @file Student-facing form service: fetch available forms and resolve file download URLs. */

import { authHeaders, apiFetch } from "./authService";
import API_BASE_URL from "./apiConfig";

const SERVER_URL = API_BASE_URL;
const FORMS_API_URL = `${SERVER_URL}/api/forms`;

/** Fetches all forms published by the admin. Handles both array and { forms: [] } response shapes. */
export async function getStudentForms() {
  const response = await apiFetch(FORMS_API_URL, {
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load forms");
  }

  // Backend returns either an array directly or { forms: [...] }
  if (Array.isArray(data)) {
    return data;
  }

  return data.forms || [];
}

/** Resolves the full download URL for a form's file, handling both absolute and relative paths. */
export function getFormFileUrl(form) {
  const filePath = form.fileUrl || form.filePath || form.path || "";

  if (!filePath) {
    return "";
  }

  if (filePath.startsWith("http")) {
    return filePath;
  }

  return `${SERVER_URL}${filePath}`;
}