// src/server.ts
import { Server } from "socket.io";
import http from "http";
import app from "./app";
import { redisSubscriber } from "./config/redis.config";
import {
  markNotificationsAsRead,
} from "./services/notification.service";
import connectDB from "./config/mongo.config";
import logger from "./config/logger.config";

const server = http.createServer(app);
connectDB();

export const io = new Server(server , {
  cors: {
    origin: true, 
    methods: ["GET", "POST"],
    allowedHeaders: "*",
    credentials: true
  }
});

io.on("connection", (socket) => {
  logger.info("A user connected");

  // Subscribe to Redis notifications
  redisSubscriber.subscribe(
    "newComment",
    "newReply",
    "newPost",
    (err, count) => {
      if (err) {
        logger.error("Failed to subscribe: %s", err.message);
      } else {
        logger.info(
          `Subscribed successfully! This client is currently subscribed to ${count} channels.`
        );
      }
    }
  );

  // Listen for messages from Redis and emit to clients
  redisSubscriber.on("message", (channel, message) => {
    logger.info("Recieved");
    socket.emit(channel, JSON.parse(message));
  });

  socket.on("disconnect", () => {
    logger.info("A user disconnected");
  });

  // src/server.ts (within io.on('connection'))
  socket.on("fetchNotifications", async (userId) => {
    const notifications = await markNotificationsAsRead(userId);
    socket.emit("notifications", notifications);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
