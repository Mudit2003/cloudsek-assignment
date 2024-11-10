import Redis, { RedisOptions } from "ioredis";

const redis = new Redis(process.env.REDIS_SERVICE_URI as RedisOptions);
export const redisPublisher = new Redis(process.env.REDIS_SERVICE_URI as RedisOptions);
export const redisSubscriber = new Redis(process.env.REDIS_SERVICE_URI as RedisOptions);

export default redis 
