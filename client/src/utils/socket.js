import { io } from "socket.io-client";

let socket;

export function initSocket(userId) {
  socket = io("http://localhost:6000", {
    query: { userId },
    transports: ["websocket"],
  });

  return socket;
}

export function getSocket() {
  return socket;
}
