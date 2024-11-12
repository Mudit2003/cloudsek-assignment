import mongoose from "mongoose";
import prisma from "../config/prisma.config";
import redis from "../config/redis.config";
import {io as socketServer} from "../server"
import logger from "../config/logger.config";


// Shudown after removing everything
export const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();

    await prisma.$disconnect();

    await redis.quit();

    socketServer.close(() => {
      logger.info("Socket.IO server disconnected.");
    });

    logger.info("Graceful shutdown complete. Exiting process...");
    process.exit(0); // Exit the application cleanly
  } catch (error) {
    logger.error("Error during graceful shutdown:", error);
    process.exit(1); // Exit with error code if the shutdown fails
  }
};

// Termination Signals management
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown); 