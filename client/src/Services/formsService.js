
const API_URL = "http://localhost:3000/api/forms";

export async function getForms() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load forms");
  }

  return response.json();
}

export async function createForm(formData) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create form");
  }

  return response.json();
}

// Update only the form's metadata (title, description, category)
export async function updateForm(id, updatedFields) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Telling the backend we are sending JSON data
    },
    body: JSON.stringify(updatedFields), // Sends { title, description, category }
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
  });

  if (!response.ok) {
    throw new Error("Failed to delete form");
  }

  return response.json();
}