import { apiFetch, authHeaders } from "./authService";

const API_URL = `${import.meta.env.VITE_API_URL}/api/stats`;

export async function getStats() {
  const response = await apiFetch(API_URL, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load statistics");
  }

  return response.json();
}
