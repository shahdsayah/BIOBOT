/** @file Custom hook for the chat sidebar: loading the list, selecting, deleting, and starting new chats. */

import { useEffect, useReducer } from "react";
import { useToast } from "../contexts/ToastContext";
import { useLanguage } from "../contexts/languageContext";
import { getChats, getChat, deleteChat } from "../Services/chatService";

const initialState = { chats: [], activeChatTitle: null };

function chatListReducer(state, action) {
  switch (action.type) {
    case "loaded":
      return { ...state, chats: action.chats };
    case "selected":
      return { ...state, activeChatTitle: action.title };
    case "reset":
      return { ...state, activeChatTitle: null };
    default:
      return state;
  }
}

/**
 * Manages the sidebar chat list. chatId lives in BioBotPage so both this hook and useChatBot share the same value.
 * @param {{ chatId, setChatId, onNewChat, onChatLoaded, onSidebarClose }} props
 */
export function useChatList({ chatId, setChatId, onNewChat, onChatLoaded, onSidebarClose }) {
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [{ chats, activeChatTitle }, dispatch] = useReducer(chatListReducer, initialState);

  useEffect(() => {
    refreshChats();
  }, []);

  async function refreshChats() {
    try {
      const data = await getChats();
      dispatch({ type: "loaded", chats: data });
    } catch {}
  }

  async function handleSelectChat(chat) {
    try {
      const fullChat = await getChat(chat._id);
      setChatId(fullChat._id);
      dispatch({ type: "selected", title: fullChat.title });
      onChatLoaded(fullChat.messages);
      onSidebarClose();
    } catch {}
  }

  async function handleDeleteChat(id) {
    try {
      await deleteChat(id);
      if (chatId === id) {
        setChatId(null);
        dispatch({ type: "reset" });
        onNewChat();
      }
      await refreshChats();
      addToast(t("toastChatDeleted"));
    } catch {}
  }

  function handleNewChat() {
    setChatId(null);
    dispatch({ type: "reset" });
    onNewChat();
  }

  return {
    chats,
    activeChatTitle,
    refreshChats,
    handleSelectChat,
    handleDeleteChat,
    handleNewChat,
  };
}
