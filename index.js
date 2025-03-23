const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let users = [];
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));
io.on("connection", (socket) => {
  socket.on("joinChat", (username) => {
    users.push({ id: socket.id, username });
    io.emit("updateUsersCount", users.length);
    socket.broadcast.emit("message", {
      username: "البوتة💕",
      message: `العسل ${username} دخلت للموقع🤭`,
    });
  });
  socket.on("message", (message) => {
    const user = users.find((u) => u.id === socket.id);
    if (user) {
      io.emit("message", { username: user.username, message });
    }
  });

  socket.on("disconnect", () => {
    const userIndex = users.findIndex((u) => u.id === socket.id);
    if (userIndex !== -1) {
      const user = users.splice(userIndex, 1)[0];
      io.emit("updateUsersCount", users.length);
      io.emit("message", {
        username: "البوتة💕",
        message: `العسل ${user.username} خرجت من الموقع😔💔`,
      });
    }
  });
});

server.listen(14361, () => {
  console.log("running");
});