const SERVER_URL = "http://localhost:3000";
const FORMS_API_URL = `${SERVER_URL}/api/forms`;

// Get all forms uploaded by admin
export async function getStudentForms() {
  const response = await fetch(FORMS_API_URL);

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