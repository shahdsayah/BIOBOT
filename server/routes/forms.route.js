const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Form = require("../models/FormSchema");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

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
router.post("/", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
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

    res.status(201).json({
      message: "Form uploaded successfully",
      form,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to upload form",
      error: err.message,
    });
  }
});

// Get all forms for student/admin
router.get("/", requireAuth, async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });

    res.json(forms);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load forms",
      error: err.message,
    });
  }
});

// Get one form by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        message: "Form not found",
      });
    }

    res.json(form);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load form",
      error: err.message,
    });
  }
});

// Delete form by admin
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        message: "Form not found",
      });
    }

    // Delete uploaded file from uploads folder
    if (form.fileUrl) {
      const filePath = path.join(__dirname, "..", form.fileUrl);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Form.findByIdAndDelete(req.params.id);

    res.json({
      message: "Form deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete form",
      error: err.message,
    });
  }
});

// Update form information (text fields only, no file changes)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Validate that required tracking text isn't cleared out by mistake
    if (title === "" || description === "") {
      return res.status(400).json({
        message: "Title and description cannot be empty",
      });
    }

    // Find the form and update only the text fields provided in the request body
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(category !== undefined && { category: category.trim() }),
        },
      },
      { new: true, runValidators: true } // 'new: true' returns the updated document back to the client
    );

    if (!updatedForm) {
      return res.status(404).json({
        message: "Form not found",
      });
    }

    res.json({
      message: "Form information updated successfully",
      form: updatedForm,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update form information",
      error: err.message,
    });
  }
});
module.exports = router;