import mongoose from "mongoose";
import logger from "./logger.config";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  const maxRetries = 20;
  let retryCount = 0;
  let delayBetweenRetries = 3000;
  const maxDelay = 30000;

  const attemptConnection = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI!, {
        serverSelectionTimeoutMS: 5000,
      });
      retryCount = 0;
      logger.info("MongoDB connected successfully");
      return; 
    } catch (error) {
      retryCount++;
      logger.error(
        `Error connecting to MongoDB (Attempt ${retryCount}):`,
        error
      );

      if (retryCount < maxRetries) {
        // If retry count is less than max retries, wait and retry
        await delay(delayBetweenRetries);

        // Exponentially increase delay
        delayBetweenRetries = Math.min(delayBetweenRetries * 2, maxDelay); // Cap delay at maxDelay
        await attemptConnection(); // Retry the connection attempt
      } else {

        process.on("SIGINT", () => {
          logger.info("Gracefully shutting down...");
          mongoose.connection
            .close()
            .then(() => {
              process.exit(1); // Exit after cleanup
            })
            .catch((err) => {
              process.exit(1); // Exit with error
            });
        });
      }
    }
  };

  await attemptConnection();

  mongoose.connection.on("disconnected", async () => {
    logger.error("MongoDB connection lost. Reconnecting...");
    await attemptConnection();
  });

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error:", err);
  });
};

export default connectDB;
