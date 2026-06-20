const mongoose = require("mongoose"); //bring the Mongoose library into the project

const UserSchema = new mongoose.Schema( //defining the blueprint of how the data must look
  {
    firstName: {
      type: String, //will be treated as text
      required: true, // mandatory field
      trim: true, //removes leading and trailing whitespace from the string before saving it to the database
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
    timestamps: true, //date tracking
    versionKey: false, //do not track document revisions
  }
);

module.exports = mongoose.model("User", UserSchema);
