/** @file Chat history sidebar — displays the list of past conversations with select, delete, and new-chat actions. */

import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";
import { FaTrash } from "react-icons/fa";
import { useLanguage } from "../contexts/languageContext";
import { formatDate } from "../Services/dateUtils";

export default function ChatSidebar({
  chats = [],
  activeChatId = null,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) {
  const { t, language } = useLanguage();

  return (
    <aside className="flex flex-col w-72 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-500 p-4">
      <PrimarySmallButton text={t("newChat")} onClick={onNewChat} />

      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-200 mt-6 mb-3">
        {t("chatHistory")}
      </h3>

      <div className="flex-1 overflow-y-auto space-y-1">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
            <span className="text-3xl">💬</span>
            <p className="text-sm text-slate-400">{t("noChats")}</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`group flex items-center gap-1 rounded-lg border transition ${
                activeChatId === chat._id
                  ? "bg-brand/10 border-brand"
                  : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-500"
              }`}
            >
              <button
                onClick={() => onSelectChat && onSelectChat(chat)}
                className="flex-1 text-right px-3 py-3 min-w-0"
              >
                <div className={`font-semibold truncate ${
                  activeChatId === chat._id
                    ? "text-brand"
                    : "text-slate-700 dark:text-slate-200"
                }`}>
                  {chat.title || t("newChat")}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {chat.updatedAt
                    ? formatDate(chat.updatedAt, language)
                    : ""}
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat && onDeleteChat(chat._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 ml-1 text-slate-400 hover:text-red-500 transition"
                title={t("deleteChat")}
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-500">
        <p className="text-xs text-slate-400 text-center">BIOBOT 2.0</p>
      </div>
    </aside>
  );
}
