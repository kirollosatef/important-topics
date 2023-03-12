const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
require("dotenv").config();
require("./config/passport_setup");

// set up the view engine
app.set("view engine", "ejs");

// connect to mongoDB
const connectToMongoDB = async () => {
  const dbURL = process.env.DB_URL || "";
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to mongoDB");
  } catch (err) {
    console.log(err);
  }
};
connectToMongoDB();

// set up routes
app.use("/auth", authRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("app now listening for requests on port 3000");
});
