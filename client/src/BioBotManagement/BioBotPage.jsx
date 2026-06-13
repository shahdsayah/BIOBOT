import { useState } from "react";

import PageHeader from "../GUIManagement/PageHeader";
import Footer from "../GUIManagement/Footer";

import PrimarySmallButton from "../GUIManagement/PrimarySmallButton";

import ChatSidebar from "./ChatSidebar";
export default function BioBotPage() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "שלום, אני ביו־בוט. איך אוכל לעזור לך בנושא נהלים, טפסים או מידע אקדמי?",
    },
  ]);

  function handleSend() {
    if (input.trim() === "") return;

    setMessages([
      ...messages,
      {
        sender: "user",
        text: input,
      },
    ]);

    setInput("");
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col">
      <PageHeader title="ביו־בוט" buttonText="דף הבית" to="/home" />

      <main className="flex-1 flex justify-center py-8">
        <div className="w-[1100px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
          <ChatSidebar />

          <section className="flex-1 flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-2xl font-bold text-[oklch(48.8%_0.243_264.376)]">
                צ׳אט אקדמי חכם
              </h2>

              <p className="text-slate-500 mt-1">
                שאל שאלות על נהלים, טפסים, בחינות ומצב אקדמי
              </p>
            </div>

            <div className="flex-1 p-6 space-y-5 bg-slate-50">
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
                    className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm leading-7 ${
                      message.sender === "user"
                        ? "bg-[oklch(48.8%_0.243_264.376)] text-white rounded-br-none"
                        : "bg-white text-slate-700 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              className="border-t border-slate-200 p-4 flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="כתוב שאלה לביו־בוט..."
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[oklch(48.8%_0.243_264.376)]"
              />

              <PrimarySmallButton text="שליחה" />
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}