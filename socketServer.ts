import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["https://it-client.vercel.app", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true, // Allow sending cookies with WebSocket requests
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected via WebSocket");

    // Listen for events from the client
    socket.on("notification", (data) => {
      // Broadcast the notification to all connected clients
      io.emit("newNotification", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
