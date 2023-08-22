const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
require("dotenv").config();

const cors = require("cors")
app.use(cors())

mongoose
  .connect(
    process.env.MONGO,
    {}
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Unable to connect to MongoDB Atlas");
    console.error(err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(bodyParser.json());

app.use("/users", userRoutes );

app.listen(3005, () => {
  console.log("Server running on port 3005");
});