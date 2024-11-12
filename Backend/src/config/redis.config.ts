import Redis, { RedisOptions } from "ioredis";
import logger from "./logger.config";

// Common retry strategy with exponential backoff
const createRetryStrategy = (times: number) => {
  // Start with a delay of 50ms and double it each retry, max 2 seconds
  const delay = Math.min(1000 * Math.pow(2, times), 30000);
  return delay;
};

// Error handling function to add listeners to a Redis instance
const setupErrorHandling = (redisInstance: Redis, name: string) => {
  redisInstance.on("error", (err) => {
    logger.error(`[${name}] Redis error:`, err);
  });

  redisInstance.on("reconnecting", (delay: number) => {
    logger.info(
      `[${name}] Attempting to reconnect to Redis after ${delay}ms...`
    );
  });

  redisInstance.on("connect", () => {
    logger.info(`[${name}] Connected to Redis.`);
  });

  redisInstance.on("ready", () => {
    logger.info(`[${name}] Redis connection is ready.`);
  });

  redisInstance.on("end", () => {
    logger.warn(`[${name}] Redis connection has ended.`);
  });

  redisInstance.on("close", () => {
    logger.warn(`[${name}] Redis connection has closed.`);
  });
};

// Create Redis instances with retry strategies and error handling
const redisOptions: RedisOptions = {
  retryStrategy: createRetryStrategy,
  reconnectOnError(err) {
    // Example to force reconnect on specific errors, like READONLY
    if (err.message.includes("READONLY")) {
      return true; // Reconnect on READONLY errors
    }
    return false; // Only retry on specific conditions
  },
};

// General-purpose Redis instance
const redis = new Redis(process.env.REDIS_SERVICE_URI as string, redisOptions);
setupErrorHandling(redis, "General");

// Publisher Redis instance
export const redisPublisher = new Redis(
  process.env.REDIS_SERVICE_URI as string,
  redisOptions
);
setupErrorHandling(redisPublisher, "Publisher");

// Subscriber Redis instance
export const redisSubscriber = new Redis(
  process.env.REDIS_SERVICE_URI as string,
  redisOptions
);
setupErrorHandling(redisSubscriber, "Subscriber");

// Export the main instance
export default redis;
