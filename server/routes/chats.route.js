
const express = require("express");

const Chat = require("../models/ChatSchema");
const User = require("../models/UserSchema");
const { requireAuth } = require("../middleware/auth");
const { retrieveAsText } = require("../rag/retriever");

const router = express.Router();

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

    const relevantKnowledge = await retrieveAsText(message, 6);

    // Format completed courses as readable text instead of raw JSON
    const coursesText = user.completedCourses?.length
      ? user.completedCourses
          .map((c) => `  • ${c.name} — ציון: ${c.grade}, נק"ז: ${c.credits}`)
          .join("\n")
      : "  אין קורסים מוגמרים עדיין";

    // Format schedule as readable text
    const scheduleText = user.schedule?.length
      ? user.schedule
          .map((s) => `  • ${s.day} ${s.startTime}–${s.endTime}: ${s.courseName}${s.room ? ` (חדר ${s.room})` : ""}`)
          .join("\n")
      : "  אין מערכת שעות רשומה";

    const systemPrompt = `You are BIO-BOT 2.0, an academic assistant for students in the Biotechnology Engineering department at ORT Braude College.

You have two sources of information — use BOTH:

1. STUDENT PERSONAL DATA (below): grades, GPA, schedule, completed courses.
   Use this to answer personal questions like "what is my GPA?", "what is my academic status?", "what courses did I complete?", "how many credits do I have?".
   Calculate GPA yourself from the course list when asked.
   Academic status rules: GPA >= 65 and no failures = תקין. GPA 60–64 = בהתראה. GPA < 60 or failed courses = על תנאי.

2. KNOWLEDGE BASE (below): official regulations, procedures, forms, staff contacts.
   Use this to answer questions about academic rules, procedures, forms, and department information.
   If the answer is NOT in the knowledge base and NOT in the student's data, say:
   "לא מצאתי מידע רשמי בנושא זה במאגר המידע שלי. מומלץ לפנות למזכירות המחלקה או לדקנט."

Always answer in the same language as the student's question.
Always include a source at the end (either "נתונים אישיים של הסטודנט" or the relevant knowledge base section).
Be concise — 3-5 sentences unless a step-by-step explanation is needed.

Student details:
- Name: ${user.firstName} ${user.lastName}
- Year: ${user.year || "לא צוין"}

Completed courses:
${coursesText}

Schedule:
${scheduleText}

Knowledge base (most relevant sections):
${relevantKnowledge}`;

    // Load existing chat — limit to last 10 messages to avoid huge prompts
    let existingChat = null;
    if (chatId) {
      existingChat = await Chat.findOne({ _id: chatId, userId: user._id });
    }
    const allMessages = existingChat ? existingChat.messages : [];
    const existingMessages = allMessages.slice(-10);

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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


module.exports = router;