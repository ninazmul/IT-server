import Redis from "ioredis";
require("dotenv").config();

// Redis connection logic with a fallback
const redisClient = () => {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  console.log(`Redis connected to ${redisUrl}`);
  return new Redis(redisUrl);
};

// Export Redis client instance
export const redis = redisClient();
