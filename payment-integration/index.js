const express = require("express");
const morgan = require("morgan");
const paypal = require("@paypal/checkout-server-sdk");
const app = express();

app.use(morgan("dev"));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Server started on port http://localhost:3000");
});
