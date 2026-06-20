import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";

export default function ChatSidebar() {
  const chats = [
    "ערעור על בחינה",
    "בקשה למועד מיוחד",
    "טפסים אקדמיים",
    "מצב אקדמי",
  ];

  return (
    <aside className="hidden sm:block w-64 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-4">
      <PrimarySmallButton text="שיחה חדשה" />

      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-6 mb-3">
        היסטוריית שיחות
      </h3>

      <div className="space-y-2">
        {chats.map((chat) => (
          <button
            key={chat}
            className="w-full text-right px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            {chat}
          </button>
        ))}
      </div>
    </aside>
  );
}
