/** @file Custom hook for chatbot message management: send, receive, scroll, feedback, and language-aware welcome message. */

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../contexts/languageContext";
import { sendMessage, submitFeedback } from "../Services/chatService";

/**
 * Manages messages, input state, and like/dislike feedback for the chat UI.
 * chatId is owned by BioBotPage and passed in — this hook does not manage it.
 * @param {{ chatId, onChatCreated, onAfterSend }} props
 */
export function useChatBot({ chatId, onChatCreated, onAfterSend }) {
  const { t } = useLanguage();

  const messagesContainerRef = useRef(null);
  const [messages, setMessages] = useState([{ sender: "bot", text: "" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Re-translate the initial welcome message when the user switches language
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0]?.sender !== "bot" || prev[0]?.suggestedForm) return prev;
      return [{ ...prev[0], text: t("bioBotWelcome") }];
    });
  }, [t]);

  // Scroll inside the container — not the page — to avoid the page jumping on new messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage(question, chatId);

      if (!chatId) onChatCreated(response.chat._id);

      const botMsg = response.chat.messages[response.chat.messages.length - 1];

      setMessages((prev) => [
        ...prev,
        {
          _id: botMsg?._id || null,
          sender: "bot",
          text: response.answer,
          suggestedForm: response.suggestedForm || null,
          feedback: null,
        },
      ]);

      await onAfterSend();
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: t("bioBotError") }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback(messageIndex, messageId, feedback) {
    if (!chatId || !messageId) return;

    const current = messages[messageIndex]?.feedback;
    const newFeedback = current === feedback ? null : feedback;

    setMessages((prev) =>
      prev.map((m, i) => (i === messageIndex ? { ...m, feedback: newFeedback } : m))
    );

    try {
      await submitFeedback(chatId, messageId, newFeedback);
    } catch {
      // Revert the optimistic update if the API call fails
      setMessages((prev) =>
        prev.map((m, i) => (i === messageIndex ? { ...m, feedback: current } : m))
      );
    }
  }

  function resetMessages() {
    setMessages([{ sender: "bot", text: t("bioBotWelcome") }]);
    setInput("");
  }

  function loadMessages(chatMessages) {
    setMessages(chatMessages);
  }

  return {
    messages,
    input,
    setInput,
    loading,
    messagesContainerRef,
    handleSend,
    handleFeedback,
    resetMessages,
    loadMessages,
  };
}
