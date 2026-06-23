import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";
import { FaTrash } from "react-icons/fa";

export default function ChatSidebar({
  chats = [],
  activeChatId = null,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) {
  return (
    <aside className="hidden sm:flex flex-col w-72 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-4">
      <PrimarySmallButton text="שיחה חדשה" onClick={onNewChat} />

      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-6 mb-3">
        היסטוריית שיחות
      </h3>

      <div className="flex-1 overflow-y-auto space-y-1">
        {chats.length === 0 ? (
          <p className="text-sm text-slate-400">עדיין אין שיחות.</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`group flex items-center gap-1 rounded-lg border transition ${
                activeChatId === chat._id
                  ? "bg-brand/10 border-brand"
                  : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
              }`}
            >
              <button
                onClick={() => onSelectChat && onSelectChat(chat)}
                className="flex-1 text-right px-3 py-3 min-w-0"
              >
                <div className={`font-semibold truncate ${
                  activeChatId === chat._id
                    ? "text-brand"
                    : "text-slate-700 dark:text-slate-300"
                }`}>
                  {chat.title || "שיחה חדשה"}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {chat.updatedAt
                    ? new Date(chat.updatedAt).toLocaleDateString("he-IL")
                    : ""}
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat && onDeleteChat(chat._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 ml-1 text-slate-400 hover:text-red-500 transition"
                title="מחק שיחה"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-400 text-center">BIOBOT 2.0</p>
      </div>
    </aside>
  );
}
