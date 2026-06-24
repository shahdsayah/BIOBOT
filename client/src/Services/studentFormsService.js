import { getToken, apiFetch } from "./authService";
import API_BASE_URL from "./apiConfig";

const SERVER_URL = API_BASE_URL;
const FORMS_API_URL = `${SERVER_URL}/api/forms`;

// Get all forms uploaded by admin
export async function getStudentForms() {
  const token = getToken();
  const response = await apiFetch(FORMS_API_URL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load forms");
  }

  // Supports both cases:
  // backend returns array directly OR { forms: [...] }
  if (Array.isArray(data)) {
    return data;
  }

  return data.forms || [];
}

// Build full file URL for uploaded files
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