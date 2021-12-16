/** @format */

const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const formatMessage = require("./utils/message");
const { userJoin, getCurrentUser, userLeave } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const botName = "ChatCord Bot";

//set static foler

app.use(express.static(path.join(__dirname, "public")));

//socket Connection

io.on("connection", (socket) => {
  //Join room server side
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    //Welcome message
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
      );
  });

  //listen for texts

  socket.on("chatMessage", (text) => {
    const currentUser = getCurrentUser(socket.id);

    io.to(currentUser.room).emit(
      "message",
      formatMessage(currentUser.username, text)
    );
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    const leftUser = userLeave(socket.id);

    if (leftUser) {
      io.to(leftUser.room).emit(
        "message",
        formatMessage(botName, `${leftUser.username} has left the chat`)
      );
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log("Server Run Successfully");
});
