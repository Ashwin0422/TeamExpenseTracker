// config/redis.js
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Error:", err.message));
redisClient.on("connect", () => console.log("Redis connected to Upstash"));

const connectRedis = async () => {
  await redisClient.connect();
};

module.exports = { redisClient, connectRedis };