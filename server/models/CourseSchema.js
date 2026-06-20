const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    credits: { type: Number, required: true },
    mandatory: { type: Boolean, default: true },
    semester: { type: String },
    yearOfStudy: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Course", CourseSchema);
