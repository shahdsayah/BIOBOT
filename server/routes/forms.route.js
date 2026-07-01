/** @file Forms routes: upload, list, update, and delete academic forms. Files are stored on disk via multer. */

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Form = require("../models/FormSchema");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const {
  includesHebrewMatch,
} = require("../utils/hebrewTextUtils");


// Create uploads folder if it does not exist
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload new form by admin
router.post("/", requireAdmin, upload.single("file"), async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const form = await Form.create({
      title,
      description,
      category: category || "",
      fileUrl: `/uploads/${req.file.filename}`,
      originalFileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      createdBy: createdBy || "admin",
    });

    res.status(201).json({ message: "Form uploaded successfully", form });
  } catch (err) {
    next(err);
  }
});

// Get all forms for student/admin
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { search } = req.query;

    let forms = await Form.find().sort({ createdAt: -1 });

    if (search && search.trim() !== "") {
      forms = forms.filter((form) =>
        includesHebrewMatch(form.title, search) ||
        includesHebrewMatch(form.description, search) ||
        includesHebrewMatch(form.category, search)
      );
    }

    res.json(forms);
  } catch (err) {
    next(err);
  }
});

// Get one form by ID
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (err) {
    next(err);
  }
});

// Delete form by admin
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.fileUrl) {
      const filePath = path.join(__dirname, "..", form.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Form.findByIdAndDelete(req.params.id);

    res.json({ message: "Form deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// Update form information (text fields only, no file changes)
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (title === "" || description === "") {
      return res.status(400).json({ message: "Title and description cannot be empty" });
    }

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(category !== undefined && { category: category.trim() }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({ message: "Form updated successfully", form: updatedForm });
  } catch (err) {
    next(err);
  }
});
module.exports = router;