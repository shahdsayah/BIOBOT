/** @file Mongoose schema for users. Stores personal info, role, weekly schedule, and completed courses with grades. */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    year: {
      type: String,
      default: "",
    },

    schedule: [
      {
        day: String,
        startTime: String,
        endTime: String,
        courseName: String,
        room: String,
      },
    ],

    completedCourses: [
      {
        name: String,
        credits: Number,
        grade: Number,
        semester: String,
        yearOfStudy: Number,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", UserSchema);
