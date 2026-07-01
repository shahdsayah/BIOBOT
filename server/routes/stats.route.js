/** @file Stats route: aggregates and returns platform-wide statistics for the admin dashboard. */

const express = require("express");
const router = express.Router();

const User = require("../models/UserSchema");
const Form = require("../models/FormSchema");
const Chat = require("../models/ChatSchema");
const { requireAdmin } = require("../middleware/auth");

// Reusable pipeline stage: flatten each chat's messages array into one document per message.
const unwindMessages = [{ $unwind: "$messages" }];

function feedbackPipeline(feedback) {
  return [
    ...unwindMessages,
    { $match: { "messages.sender": "bot", "messages.feedback": feedback } },
    { $sort: { "messages.createdAt": -1 } },
    { $limit: 30 },
    {
      $project: {
        _id: 0,
        text: "$messages.text",
        feedback: "$messages.feedback",
        createdAt: "$messages.createdAt",
      },
    },
  ];
}

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalForms,
      totalChats,
      questionCount,
      topQuestions,
      likedAnswers,
      dislikedAnswers,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Form.countDocuments(),
      Chat.countDocuments(),
      // Aggregation framework ($unwind + $match + $count) instead of pulling every chat into Node.
      Chat.aggregate([
        ...unwindMessages,
        { $match: { "messages.sender": "user" } },
        { $count: "total" },
      ]),
      // $group + $sum tallies identical (trimmed, lowercased) questions server-side.
      Chat.aggregate([
        ...unwindMessages,
        { $match: { "messages.sender": "user" } },
        { $project: { text: { $trim: { input: { $toLower: "$messages.text" } } } } },
        { $group: { _id: "$text", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, text: "$_id", count: 1 } },
      ]),
      Chat.aggregate(feedbackPipeline("like")),
      Chat.aggregate(feedbackPipeline("dislike")),
    ]);

    res.json({
      totalUsers,
      totalForms,
      totalQuestions: questionCount[0]?.total || 0,
      totalChats,
      topQuestions,
      likedAnswers,
      dislikedAnswers,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
