const express = require("express");
const router = express.Router();

const User = require("../models/UserSchema");

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create(req.body);

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;