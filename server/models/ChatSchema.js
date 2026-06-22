const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      default: "שיחה חדשה",
      trim: true,
    },

    messages: [
      {
        sender: {
          type: String,
          enum: ["user", "bot"],
          required: true,
        },

        text: {
          type: String,
          required: true,
          trim: true,
        },

        source: {
          type: String,
          default: "",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);