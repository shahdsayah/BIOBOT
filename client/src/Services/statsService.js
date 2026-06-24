import { apiFetch, authHeaders } from "./authService";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/stats`;

export async function getStats() {
  const response = await apiFetch(API_URL, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load statistics");
  }

  return response.json();
}
