const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRoute = require("./routes/users.route");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("BIOBOT SERVER RUNNING");
});

const PORT = process.env.PORT || 3000;

app.use("/api/users", usersRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});