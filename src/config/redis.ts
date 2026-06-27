import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

export const connectRedis = async () => {
  // ioredis auto-connects, but this function can remain for compatibility
};

export default redisClient;
