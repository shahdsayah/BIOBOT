const express = require("express");
const router = express.Router();

const User = require("../models/UserSchema");
const Form = require("../models/FormSchema");
const Chat = require("../models/ChatSchema");
const { requireAdmin } = require("../middleware/auth");

router.get("/", requireAdmin, async (req, res) => {
  try {
    const [totalUsers, totalForms, chats] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Form.countDocuments(),
      Chat.find({}, { messages: 1 }),
    ]);

    // כל הודעות user מכל השיחות
    const allUserMessages = chats.flatMap((chat) =>
      chat.messages.filter((m) => m.sender === "user").map((m) => m.text)
    );

    const totalQuestions = allUserMessages.length;

    // מצא את 5 השאלות הנפוצות ביותר (לפי טקסט מדויק)
    const frequency = {};
    for (const text of allUserMessages) {
      const normalized = text.trim().toLowerCase();
      frequency[normalized] = (frequency[normalized] || 0) + 1;
    }

    const topQuestions = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([text, count]) => ({ text, count }));

    res.json({
      totalUsers,
      totalForms,
      totalQuestions,
      totalChats: chats.length,
      topQuestions,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load statistics", error: err.message });
  }
});

module.exports = router;
