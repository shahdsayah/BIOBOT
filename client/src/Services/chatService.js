/** @file API calls for the chatbot: send messages, load/delete chat history, and submit like/dislike feedback. */

import { apiFetch, authHeaders } from "./authService";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/chats`;

/** Extracts a readable error message from a failed response. */
async function parseError(response) {
  try {
    const data = await response.json();
    return data.message || "Something went wrong";
  } catch {
    return "Something went wrong";
  }
}

/** Sends a message to the bot. Pass chatId to continue an existing chat, or null to start a new one. */
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

/** Returns all chat sessions for the logged-in user (sidebar list). */
export async function getChats() {
  const response = await apiFetch(API_URL, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

/** Loads the full message history of a single chat by ID. */
export async function getChat(chatId) {
  const response = await apiFetch(`${API_URL}/${chatId}`, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

/** Submits like/dislike feedback on a bot message. @param {string} feedback - "like" | "dislike" | null */
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

/** Deletes a chat and all its messages. */
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
