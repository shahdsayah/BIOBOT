import { apiFetch, authHeaders } from "./authService";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/chats`;

async function parseError(response) {
  try {
    const data = await response.json();
    return data.message || "Something went wrong";
  } catch {
    return "Something went wrong";
  }
}

export async function sendMessage(message, chatId = null) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ message, chatId }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function getChats() {
  const response = await apiFetch(API_URL, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function getChat(chatId) {
  const response = await apiFetch(`${API_URL}/${chatId}`, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function submitFeedback(chatId, messageId, feedback) {
  const response = await apiFetch(`${API_URL}/${chatId}/messages/${messageId}/feedback`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ feedback }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function deleteChat(chatId) {
  const response = await apiFetch(`${API_URL}/${chatId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
