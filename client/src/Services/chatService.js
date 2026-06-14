export async function saveMessage(userEmail, message) {
  console.log("Saving message:", {
    userEmail,
    message,
  });

  return {
    success: true,
  };
}

export async function getChatHistory(userEmail) {
  console.log("Getting chat history for:", userEmail);

  return [];
}

export async function deleteChat(chatId) {
  console.log("Deleting chat:", chatId);

  return {
    success: true,
  };
}