// utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://buzzbook-server-dy0q.onrender.com", {
      transports: ["websocket"],
      withCredentials: true,
    });
  }
  return socket;
};
