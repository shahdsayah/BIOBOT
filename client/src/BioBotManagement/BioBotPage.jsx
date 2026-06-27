import { useEffect, useRef, useState } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";
import ChatSidebar from "./ChatSidebar";
import API_BASE_URL from "../Services/apiConfig";
import { useLanguage } from "../contexts/languageContext";

import { sendMessage, getChats, getChat, deleteChat, submitFeedback } from "../Services/chatService";

export default function BioBotPage() {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatTitle, setActiveChatTitle] = useState(null);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: t("bioBotWelcome"),
    },
  ]);

  useEffect(() => {
    setMessages((prev) => {
      if (
        prev.length !== 1 ||
        prev[0]?.sender !== "bot" ||
        prev[0]?.suggestedForm
      ) {
        return prev;
      }

      return [{ ...prev[0], text: t("bioBotWelcome") }];
    });
  }, [t]);

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

      const lastMessages = response.chat.messages;
      const botMsg = lastMessages[lastMessages.length - 1];

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

      await refreshChats();
    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: t("bioBotError"),
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
        text: t("bioBotWelcome"),
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
      setMessages((prev) =>
        prev.map((m, i) => (i === messageIndex ? { ...m, feedback: current } : m))
      );
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
      className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col"
    >
      <PageHeader
        title={t("bioBotPage")}
        buttonText={t("homeButton")}
        to="/home"
        showLanguageToggle
      />

      <main className="flex-1 flex justify-center py-4 sm:py-8 px-4">
        <div className="w-full max-w-[1100px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex overflow-hidden">
          <ChatSidebar
            chats={chats}
            activeChatId={chatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />

          <section className="flex-1 flex flex-col">
            <div className="border-b border-slate-200 dark:border-slate-500 px-6 py-4">
              <h2 className="text-2xl font-bold text-brand truncate">
                {activeChatTitle || t("bioBotTitle")}
              </h2>

              <p className="text-slate-500 dark:text-slate-200 mt-1">
                {t("bioBotSubtitle")}
              </p>
            </div>

            <div className="flex-1 p-6 space-y-5 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    message.sender === "user" ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm leading-7 whitespace-pre-line ${
                      message.sender === "user"
                        ? "bg-brand text-white rounded-br-none"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-500 rounded-bl-none"
                    }`}
                  >
                    {message.text}
                    {message.suggestedForm && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-500">
                        <p className="text-sm text-slate-500 dark:text-slate-200 mb-2">
                          {t("bioBotSuggestedForm")}
                        </p>
                        <a
                          href={`${API_BASE_URL}${message.suggestedForm.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-brand text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition"
                        >
                          📄 {message.suggestedForm.title} - {t("bioBotOpenSuggestedForm")}
                        </a>
                      </div>
                    )}
                  </div>

                  {message.sender === "bot" && message._id && (
                    <div className="flex gap-2 mt-1 mr-1">
                      <button
                        type="button"
                        title={t("feedbackLike")}
                        onClick={() => handleFeedback(index, message._id, "like")}
                        className={`text-lg transition hover:scale-110 ${
                          message.feedback === "like"
                            ? "opacity-100"
                            : "opacity-30 hover:opacity-70"
                        }`}
                      >
                        👍
                      </button>
                      <button
                        type="button"
                        title={t("feedbackDislike")}
                        onClick={() => handleFeedback(index, message._id, "dislike")}
                        className={`text-lg transition hover:scale-110 ${
                          message.feedback === "dislike"
                            ? "opacity-100"
                            : "opacity-30 hover:opacity-70"
                        }`}
                      >
                        👎
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-end">
                  <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-500 px-5 py-4 rounded-2xl shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              className="border-t border-slate-200 dark:border-slate-500 bg-white dark:bg-slate-900 p-4 flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("bioBotPlaceholder")}
                disabled={loading}
                className="flex-1 border border-slate-300 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-xl px-4 py-3 outline-none focus:border-brand"
              />

              <PrimarySmallButton text={loading ? t("bioBotThinking") : t("bioBotSend")} />
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}