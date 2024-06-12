const Redis = require("ioredis");
const redisClient = new Redis(process.env.REDIS_URI, {
  tls: {
    rejectUnauthorized: false,
  },
});

async function invalidateCache(pattern) {
  let cursor = "0";
  do {
    const [newCursor, keys] = await redisClient.scan(cursor, "MATCH", pattern);
    for (const key of keys) {
      await redisClient.del(key);
    }
    cursor = newCursor;
  } while (cursor !== "0");
}

module.exports = { redisClient, invalidateCache };
