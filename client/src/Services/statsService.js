/** @file Fetches admin statistics (user counts, chat activity, liked/disliked answers). */

import { apiFetch, authHeaders } from "./authService";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/stats`;

/** Fetches aggregated platform statistics for the admin dashboard. */
export async function getStats() {
  const response = await apiFetch(API_URL, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load statistics");
  }

  return response.json();
}
