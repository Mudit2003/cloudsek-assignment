// src/server.ts
import { Server } from "socket.io";
import http from "http";
import app from "./app";
import { redisSubscriber } from "./config/redis.config";
import { authenticateSocket } from "./middlewares/socketauth.middleware";
import {
  getNotificationsForUser,
  markNotificationsAsRead,
} from "./services/notification.service";
import connectDB from "./config/mongo.config";

const server = http.createServer(app);
connectDB();

export const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Subscribe to Redis notifications
  redisSubscriber.subscribe(
    "newComment",
    "newReply",
    "newPost",
    (err, count) => {
      if (err) {
        console.error("Failed to subscribe: %s", err.message);
      } else {
        console.log(
          `Subscribed successfully! This client is currently subscribed to ${count} channels.`
        );
      }
    }
  );

  // Listen for messages from Redis and emit to clients
  redisSubscriber.on("message", (channel, message) => {
    console.log("Recieved");
    socket.emit(channel, JSON.parse(message));
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // src/server.ts (within io.on('connection'))
  socket.on("fetchNotifications", async (userId) => {
    const notifications = await markNotificationsAsRead(userId);
    socket.emit("notifications", notifications);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
