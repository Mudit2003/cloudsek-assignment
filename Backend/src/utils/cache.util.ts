import redisClient from "../config/redis.config";

export const setCache = async (
  key: string,
  value: any,
  expirationInSeconds?: number
): Promise<void> => {
  const stringValue = JSON.stringify(value);
  if (expirationInSeconds) {
    await redisClient.expire(key, expirationInSeconds);
  } else {
    await redisClient.set(key, stringValue);
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
};

export const deleteCache = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

export const deletePattern = async (pattern: string): Promise<void> => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

export const clearAllCache = async (): Promise<void> => {
  await redisClient.flushall();
};

export const markStale = async (key: string): Promise<void> => {
  await redisClient.expire(key, 1);
};
