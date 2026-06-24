import { apiFetch, authHeaders } from "./authService";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/chats`;

// Send message to Gemini
export async function sendMessage(message, chatId = null) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ message, chatId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send message");
  }

  return data;
}

// Get all chats
export async function getChats() {
  const response = await apiFetch(API_URL, {
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load chats");
  }

  return data;
}

// Get one chat
export async function getChat(chatId) {
  const response = await apiFetch(`${API_URL}/${chatId}`, {
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load chat");
  }

  return data;
}

// Delete chat
export async function deleteChat(chatId) {
  const response = await apiFetch(`${API_URL}/${chatId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete chat");
  }

  return data;
}
