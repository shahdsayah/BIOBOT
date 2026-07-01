/** @file User routes: register, login, get/update/delete users. Includes semester-to-year helper. */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/UserSchema");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const academicTemplates = require("../data/academicTemplates");
const randomGrade = require("../utils/randomGrade");

function yearFromSemester(semester) {
  if (semester >= 1 && semester <= 2) return "א";
  if (semester >= 3 && semester <= 4) return "ב";
  if (semester >= 5 && semester <= 6) return "ג";
  if (semester >= 7 && semester <= 8) return "ד";
  return null;
}

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, semester } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role || "student";
    const academicFields = {};

    if (assignedRole !== "admin") {
      const semesterNum = Number(semester);

      if (!Number.isInteger(semesterNum) || semesterNum < 1 || semesterNum > 8) {
        return res.status(400).json({ message: "Semester must be a number between 1 and 8" });
      }

      const mappedYear = yearFromSemester(semesterNum);
      const template = academicTemplates.find((item) => item.year === mappedYear);

      if (!template) {
        return res.status(400).json({ message: "No academic template found for selected semester" });
      }

      academicFields.year = template.year;
      academicFields.schedule = template.schedule;
      academicFields.completedCourses = template.completedCourses.map((course) => ({
        ...course,
        grade: randomGrade(),
      }));
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: assignedRole,
      ...academicFields,
    });

    const { password: _pw, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _pw, ...userWithoutPassword } = user.toObject();
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
});

// Get all users (admin)
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Get user by ID
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Update user
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { password, role, ...safeFields } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      safeFields,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// Delete user (admin)
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
