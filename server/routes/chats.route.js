
const express = require("express");

const Chat = require("../models/ChatSchema");
const User = require("../models/UserSchema");
const { requireAuth } = require("../middleware/auth");
const knowledgeBase = require("../data/knowledgeBase");
const { normalizeHebrewText } = require("../utils/hebrewTextUtils");
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/", requireAuth, async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const relevantKnowledge = getRelevantKnowledge(message, knowledgeBase);

    const systemPrompt = `You are BIO-BOT 2.0, an academic assistant for students in the Biotechnology Engineering department at ORT Braude College.

Answer only according to the knowledge base below.
If the answer is not in the knowledge base, say:
"לא מצאתי מידע רשמי בנושא זה במאגר המידע שלי. מומלץ לפנות למזכירות המחלקה או לדקנט."

Always answer in the same language as the student's question.
Always include a source/reference at the end.

Student details:
Name: ${user.firstName} ${user.lastName}
Email: ${user.email}
Role: ${user.role}
Year: ${user.year || "לא צוין"}

Completed courses:
${JSON.stringify(user.completedCourses || [], null, 2)}

Schedule:
${JSON.stringify(user.schedule || [], null, 2)}

Knowledge base:
${relevantKnowledge}`;

    // Load existing chat so Gemini has full conversation context
    let existingChat = null;
    if (chatId) {
      existingChat = await Chat.findOne({ _id: chatId, userId: user._id });
    }
    const existingMessages = existingChat ? existingChat.messages : [];

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "הבנתי. אני מוכן לענות על שאלות הסטודנט לפי מאגר המידע." }] },
      ...existingMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.json();

      return res.status(500).json({
        message: "Gemini API request failed",
        error: error.error?.message || "Unknown Gemini error",
      });
    }

    const data = await geminiResponse.json();

    const botAnswer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "לא התקבלה תשובה מהמערכת.";

    let chat;

    if (chatId) {
      chat = existingChat;

      if (!chat) {
        return res.status(404).json({
          message: "Chat not found",
        });
      }

      chat.messages.push(
        {
          sender: "user",
          text: message,
        },
        {
          sender: "bot",
          text: botAnswer,
        }
      );

      await chat.save();
    } else {
      chat = await Chat.create({
        userId: user._id,
        userEmail: user.email,
        title: message.slice(0, 40),
        messages: [
          {
            sender: "user",
            text: message,
          },
          {
            sender: "bot",
            text: botAnswer,
          },
        ],
      });
    }

    res.json({
      answer: botAnswer,
      chat,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to process chat message",
      error: err.message,
    });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.user.id,
    }).sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load chats",
      error: err.message,
    });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load chat",
      error: err.message,
    });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({
      message: "Chat deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete chat",
      error: err.message,
    });
  }
});

function getRelevantKnowledge(question, knowledgeBase) {
  const normalizedQuestion = normalizeHebrewText(question);

  const sections = knowledgeBase.split("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const relevantSections = sections.filter((section) => {
    const normalizedSection = normalizeHebrewText(section);

    return normalizedQuestion
      .split(" ")
      .some((word) => normalizedSection.includes(word));
  });

  return relevantSections.length > 0
    ? relevantSections.join("\n\n")
    : knowledgeBase;
}

module.exports = router;