const express = require("express");
const path = require("path");
const app = express();

const httpServer = require("http").createServer(app);
const socket = require("socket.io");
const IO = socket(httpServer);

IO.on("connection", (client) => {
  console.log("New client connected");
  client.on("clientEvent", () => {
    console.log("Client Event Received");
  });
});

// open index page from public folder
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
