/** @file BioBot chatbot page component. */

import { useState } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";
import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";
import ChatSidebar from "./ChatSidebar";
import API_BASE_URL from "../Services/apiConfig";
import { useLanguage } from "../contexts/languageContext";

import { useChatBot } from "./useChatBot";
import { useChatList } from "./useChatList";

/*
 * Page: BioBot Chatbot
 * AI-powered academic assistant with a collapsible chat history sidebar, like/dislike feedback per answer, and mobile overlay support.
 */
export default function BioBotPage() {
  const { t } = useLanguage();

  const [chatId, setChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    messages,
    input,
    setInput,
    loading,
    messagesContainerRef,
    handleSend,
    handleFeedback,
    resetMessages,
    loadMessages,
  } = useChatBot({
    chatId,
    onChatCreated: setChatId,
    onAfterSend: () => refreshChats(),
  });

  const {
    chats,
    activeChatTitle,
    refreshChats,
    handleSelectChat,
    handleDeleteChat,
    handleNewChat,
  } = useChatList({
    chatId,
    setChatId,
    onNewChat: resetMessages,
    onChatLoaded: loadMessages,
    onSidebarClose: () => setSidebarOpen(false),
  });

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <PageHeader
        title={t("bioBotPage")}
        buttonText={t("homeButton")}
        to="/home"
        showLanguageToggle
      />

      <main className="flex-1 flex justify-center py-4 sm:py-8 px-4 min-h-0">
        <div
          className="w-full max-w-[1100px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex overflow-hidden relative"
          style={{ height: "calc(100vh - 120px)" }}
        >
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-20 sm:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className={`absolute sm:relative z-30 h-full transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full sm:translate-x-0"}`}>
            <ChatSidebar
              chats={chats}
              activeChatId={chatId}
              onNewChat={() => { handleNewChat(); setSidebarOpen(false); }}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
            />
          </div>

          <section className="flex-1 flex flex-col min-w-0">
            <div className="border-b border-slate-200 dark:border-slate-500 px-4 sm:px-6 py-4 flex items-center gap-3">
              <button
                type="button"
                className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setSidebarOpen((v) => !v)}
              >
                ☰
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-brand truncate">
                {activeChatTitle || t("bioBotTitle")}
              </h2>
              <p className="text-slate-500 dark:text-slate-200 mt-1">
                {t("bioBotSubtitle")}
              </p>
            </div>

            <div ref={messagesContainerRef} className="flex-1 p-6 space-y-5 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.sender === "user" ? "items-start" : "items-end"}`}
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
                        className={`text-lg transition hover:scale-110 ${message.feedback === "like" ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                      >
                        👍
                      </button>
                      <button
                        type="button"
                        title={t("feedbackDislike")}
                        onClick={() => handleFeedback(index, message._id, "dislike")}
                        className={`text-lg transition hover:scale-110 ${message.feedback === "dislike" ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
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
            </div>

            <form
              className="border-t border-slate-200 dark:border-slate-500 bg-white dark:bg-slate-900 p-4 flex gap-3"
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
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
