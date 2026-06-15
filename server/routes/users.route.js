//CRUD FUNCTIONS

const express = require("express");
const router = express.Router();

const User = require("../models/UserSchema");
//status codes: (400 - Bad Request) , (201 - Created), 

//CREATE user -register
router.post("/register", async (req, res) => {
  //checking for an existing user:
  try {
    const existingUser = await User.findOne({ 
      email: req.body.email,
    });

    //Handling Duplicates (if the email exsits in the db)
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    //Creating the New User:
    const user = await User.create(req.body);

    res.status(201).json(user);
  } catch (err) { //catch unexpected error
    res.status(500).json(err);
  }
});

//CREATE user - login
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



//GET User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});


//UPDATE User
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});


//DELETE User
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


//Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;