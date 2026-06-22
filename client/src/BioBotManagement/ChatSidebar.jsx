import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";

export default function ChatSidebar({
  chats = [],
  activeChatId = null,
  onNewChat,
  onSelectChat,
}) {
  return (
    <aside className="hidden sm:flex flex-col w-72 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-4">
      <PrimarySmallButton
        text="שיחה חדשה"
        onClick={onNewChat}
      />

      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-6 mb-3">
        היסטוריית שיחות
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.length === 0 ? (
          <p className="text-sm text-slate-400">
            עדיין אין שיחות.
          </p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() =>
                onSelectChat && onSelectChat(chat)
              }
              className={`w-full text-right px-3 py-3 rounded-lg transition border ${
                activeChatId === chat._id
                  ? "bg-brand/10 border-brand text-brand dark:text-brand"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              }`}
            >
              <div className="font-semibold truncate">
                {chat.title || "שיחה חדשה"}
              </div>

              <div className="text-xs text-slate-400 mt-1">
                {chat.updatedAt
                  ? new Date(
                      chat.updatedAt
                    ).toLocaleDateString("he-IL")
                  : ""}
              </div>
            </button>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-400 text-center">
          BIOBOT 2.0
        </p>
      </div>
    </aside>
  );
}