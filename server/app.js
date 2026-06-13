require("dotenv").config(); //load secret credentials

const express = require("express"); //import Express 
const mongoose = require("mongoose");
const cors = require("cors"); //import the CORS middleware package


const usersRoute = require("./routes/users.route");
const formsRoute = require("./routes/forms.route");

const app = express(); //create the application instance

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); //lets the browser open uploaded files

//javaScript Promise
mongoose
  .connect(process.env.MONGO_URI) //trigger a connection to MongoDB
  .then(() => { //the success scenario
    console.log("MongoDB Connected");
  })
  .catch((err) => {//failure scenario
    console.log("MongoDB Connection Error:", err.message);
  });

  //set up a basic HTTP GET route on the express server
app.get("/", (req, res) => {
  res.send("BIOBOT SERVER RUNNING");
});
//req (Request): Contains information about the incoming request sent by the client.
//res (Response): Contains methods used to send data back to the client.


app.use("/api/users", usersRoute);
app.use("/api/forms", formsRoute);

const PORT = process.env.PORT || 3000; //define a port number 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});