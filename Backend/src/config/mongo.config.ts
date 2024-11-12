import mongoose from "mongoose";

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
      console.log("MongoDB connected successfully");
      return; 
    } catch (error) {
      retryCount++;
      console.error(
        `Error connecting to MongoDB (Attempt ${retryCount}):`,
        error
      );

      if (retryCount < maxRetries) {
        // If retry count is less than max retries, wait and retry
        console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
        await delay(delayBetweenRetries);

        // Exponentially increase delay
        delayBetweenRetries = Math.min(delayBetweenRetries * 2, maxDelay); // Cap delay at maxDelay
        await attemptConnection(); // Retry the connection attempt
      } else {
        console.log("Max retries reached. Could not reconnect to MongoDB.");

        process.on("SIGINT", () => {
          console.log("Gracefully shutting down...");
          mongoose.connection
            .close()
            .then(() => {
              console.log("Mongoose connection closed");
              process.exit(1); // Exit after cleanup
            })
            .catch((err) => {
              console.error("Error while closing mongoose connection:", err);
              process.exit(1); // Exit with error
            });
        });
      }
    }
  };

  await attemptConnection();

  mongoose.connection.on("disconnected", async () => {
    console.log("MongoDB connection lost. Reconnecting...");
    await attemptConnection();
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
};

export default connectDB;
