import mongoose from "mongoose";
import prisma from "../config/prisma.config";
import redis from "../config/redis.config";
import {io as socketServer} from "../server"


// Graceful shutdown function
export const gracefulShutdown = async () => {
  try {
    // 1. Close MongoDB connection (Mongoose)
    console.log("Closing MongoDB connection...");
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");

    // 2. Close Prisma Client connection
    console.log("Disconnecting Prisma client...");
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");

    // 3. Close Redis connection
    console.log("Closing Redis connection...");
    await redis.quit();
    console.log("Redis connection closed.");

    // 4. Close Socket.IO connection
    console.log("Disconnecting Socket.IO server...");
    socketServer.close(() => {
      console.log("Socket.IO server disconnected.");
    });

    console.log("Graceful shutdown complete. Exiting process...");
    process.exit(0); // Exit the application cleanly
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1); // Exit with error code if the shutdown fails
  }
};

// Listen for termination signals
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown); 