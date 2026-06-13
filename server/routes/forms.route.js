const express = require("express");
const multer = require("multer");
const router = express.Router();

const Form = require("../models/FormSchema");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Create form with file upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const form = await Form.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      createdBy: req.body.createdBy || "admin",
      fileUrl: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(form);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all forms
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete form
router.delete("/:id", async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: "Form deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;