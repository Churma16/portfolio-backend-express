import redisClient from '../../config/redis';

/**
 * Deletes all Redis keys matching the given prefix.
 * Similar to DeleteCacheByPrefix in Go.
 * @param prefix The prefix to search and delete keys for.
 */
export const deleteCacheByPrefix = async (prefix: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(`${prefix}*`);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    console.error(`Error deleting cache by prefix ${prefix}:`, error);
  }
};
