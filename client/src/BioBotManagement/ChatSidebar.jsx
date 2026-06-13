import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";

export default function ChatSidebar() {
  const chats = [
    "ערעור על בחינה",
    "בקשה למועד מיוחד",
    "טפסים אקדמיים",
    "מצב אקדמי",
  ];

  return (
    <aside className="w-64 bg-white border-l border-slate-200 p-4">
      <PrimarySmallButton text="שיחה חדשה" />

      <h3 className="text-sm font-bold text-slate-500 mt-6 mb-3">
        היסטוריית שיחות
      </h3>

      <div className="space-y-2">
        {chats.map((chat) => (
          <button
            key={chat}
            className="
              w-full
              text-right
              px-3
              py-2
              rounded-lg
              text-slate-700
              hover:bg-slate-100
              transition
            "
          >
            {chat}
          </button>
        ))}
      </div>
    </aside>
  );
}