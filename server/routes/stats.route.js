const express = require("express");
const router = express.Router();

const User = require("../models/UserSchema");
const Form = require("../models/FormSchema");
const Chat = require("../models/ChatSchema");
const { requireAdmin } = require("../middleware/auth");

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const [totalUsers, totalForms, chats] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Form.countDocuments(),
      Chat.find({}, { messages: 1, userEmail: 1, updatedAt: 1 }),
    ]);

    const allUserMessages = chats.flatMap((chat) =>
      chat.messages.filter((m) => m.sender === "user").map((m) => m.text)
    );

    const totalQuestions = allUserMessages.length;

    const frequency = {};
    for (const text of allUserMessages) {
      const normalized = text.trim().toLowerCase();
      frequency[normalized] = (frequency[normalized] || 0) + 1;
    }

    const topQuestions = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([text, count]) => ({ text, count }));

    const allBotMessages = chats.flatMap((chat) =>
      chat.messages
        .filter((m) => m.sender === "bot" && m.feedback)
        .map((m) => ({
          text: m.text,
          feedback: m.feedback,
          createdAt: m.createdAt,
        }))
    );

    const likedAnswers = allBotMessages
      .filter((m) => m.feedback === "like")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 30);

    const dislikedAnswers = allBotMessages
      .filter((m) => m.feedback === "dislike")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 30);

    res.json({
      totalUsers,
      totalForms,
      totalQuestions,
      totalChats: chats.length,
      topQuestions,
      likedAnswers,
      dislikedAnswers,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
