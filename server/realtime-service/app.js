import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.log("No userId provided, disconnecting socket.");
    socket.disconnect();
    return;
  }

  onlineUsers.set(userId, socket.id);
  console.log("User connected:", userId);

  // notify all users about this user online status
  io.emit("user-online", userId);

  //full online list to THIS user
  socket.emit("online-users", [...onlineUsers.keys()]);

//real time message handling
  socket.on("send-message", (msg) => {
    const receiverSocket = onlineUsers.get(msg.receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("new-message", msg);
    }

    // Confirm sender message was processed
    io.to(socket.id).emit("message-sent", msg);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    console.log("User disconnected:", userId);

    // Notify everyone this user is offline
    io.emit("user-offline", userId);
  });
});

const PORT = process.env.PORT_REALTIME || 5004;

server.listen(PORT, () => console.log(`Realtime server running on port ${PORT}`));
