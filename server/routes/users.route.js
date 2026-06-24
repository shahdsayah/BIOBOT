//CRUD FUNCTIONS

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/UserSchema");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const academicTemplates = require("../data/academicTemplates");
const randomGrade = require("../utils/randomGrade");
//status codes: (400 - Bad Request) , (201 - Created),

function yearFromSemester(semester) {
  if (semester >= 1 && semester <= 2) return "א";
  if (semester >= 3 && semester <= 4) return "ב";
  if (semester >= 5 && semester <= 6) return "ג";
  if (semester >= 7 && semester <= 8) return "ד";
  return null;
}

//CREATE user -register
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const role = req.body.role || "student";
    const semester = Number(req.body.semester);

    // Auto-assign a mock academic profile (year, schedule, completed
    // courses) — simulates pulling the student's record from the
    // college system. No manual entry, and works for ANY new account,
    // including ones created live during testing/demos.
    // Admin accounts don't get one — they're staff, not students.
    const academicFields = {};

    if (role !== "admin") {
      if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
        return res.status(400).json({ message: "Semester must be a number between 1 and 8" });
      }

      const mappedYear = yearFromSemester(semester);
      const template = academicTemplates.find((item) => item.year === mappedYear);

      if (!template) {
        return res.status(500).json({ message: "No academic template found for selected semester" });
      }

      academicFields.year = template.year;
      academicFields.schedule = template.schedule;
      // Each course gets its own random grade here, rather than a
      // fixed value baked into the template — so two students who
      // land on the same template don't end up with identical grades.
      academicFields.completedCourses = template.completedCourses.map(
        (course) => ({
          ...course,
          grade: randomGrade(),
        })
      );
    }

    const { semester: _ignoredSemester, ...userPayload } = req.body;

    const user = await User.create({
      ...userPayload,
      password: hashedPassword,
      ...academicFields,
    });

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message || "Registration failed" });
  }
});

//CREATE user - login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password, ...userWithoutPassword } = user.toObject();
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});



//GET User
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});


//UPDATE User
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});


//DELETE User
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});


//Get All Users
router.get("/", requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});


module.exports = router;