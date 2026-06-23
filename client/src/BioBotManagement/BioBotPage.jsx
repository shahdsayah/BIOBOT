import { useEffect, useRef, useState } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";
import ChatSidebar from "./ChatSidebar";

import { sendMessage, getChats, getChat, deleteChat } from "../Services/chatService";

export default function BioBotPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatTitle, setActiveChatTitle] = useState(null);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "שלום, אני ביו־בוט. איך אוכל לעזור לך בנושא נהלים, טפסים או מידע אקדמי?",
    },
  ]);

  useEffect(() => {
    async function loadChats() {
      try {
        const data = await getChats();
        setChats(data);
      } catch (err) {
      }
    }

    loadChats();
  }, []);

  // Auto-scroll to bottom on every new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function refreshChats() {
    try {
      const data = await getChats();
      setChats(data);
    } catch (err) {
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return;

    const question = input.trim();

    const userMessage = {
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage(question, chatId);

      if (!chatId) {
        setChatId(response.chat._id);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.answer,
        },
      ]);

      await refreshChats();
    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "אירעה שגיאה בקבלת תשובה מהמערכת. נסה שוב.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleNewChat() {
    setChatId(null);
    setActiveChatTitle(null);
    setMessages([
      {
        sender: "bot",
        text: "שלום, אני ביו־בוט. איך אוכל לעזור לך בנושא נהלים, טפסים או מידע אקדמי?",
      },
    ]);
    setInput("");
  }

  async function handleSelectChat(chat) {
    try {
      const fullChat = await getChat(chat._id);
      setChatId(fullChat._id);
      setActiveChatTitle(fullChat.title);
      setMessages(fullChat.messages);
    } catch (err) {
    }
  }

  async function handleDeleteChat(id) {
    try {
      await deleteChat(id);
      if (chatId === id) handleNewChat();
      await refreshChats();
    } catch (err) {
    }
  }
  
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col"
    >
      <PageHeader title="ביו־בוט" buttonText="דף הבית" to="/home" />

      <main className="flex-1 flex justify-center py-4 sm:py-8 px-4">
        <div className="w-full max-w-[1100px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex overflow-hidden">
          <ChatSidebar
            chats={chats}
            activeChatId={chatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />

          <section className="flex-1 flex flex-col">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-brand truncate">
                {activeChatTitle || "צ׳אט אקדמי חכם"}
              </h2>

              <p className="text-slate-500 dark:text-slate-400 mt-1">
                שאל שאלות על נהלים, טפסים, בחינות ומצב אקדמי
              </p>
            </div>

            <div className="flex-1 p-6 space-y-5 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm leading-7 whitespace-pre-line ${
                      message.sender === "user"
                        ? "bg-brand text-white rounded-br-none"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-end">
                  <div className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 px-5 py-4 rounded-2xl shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="כתוב שאלה לביו-בוט..."
                disabled={loading}
                className="flex-1 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-xl px-4 py-3 outline-none focus:border-brand"
              />

              <PrimarySmallButton text={loading ? "חושב..." : "שליחה"} />
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}