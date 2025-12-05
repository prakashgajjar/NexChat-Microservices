import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  onlineUsers.set(userId, socket.id);

  console.log("User connected:", userId);

  // REAL-TIME ONLY: forward message
  socket.on("send-message", (msg) => {
    const receiverSocket = onlineUsers.get(msg.receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("new-message", msg);
    }

    // Optional: confirm your own message is delivered
    io.to(socket.id).emit("message-sent", msg);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
  });
});

server.listen(6000, () => console.log("Realtime server on 6000"));
