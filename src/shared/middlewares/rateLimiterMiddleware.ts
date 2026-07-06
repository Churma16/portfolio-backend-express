import { Request, Response, NextFunction } from 'express';
import redisClient from '../../config/redis';
import { sendError } from '../utils/response';

export const rateLimiterMiddleware = (limitRule: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // limitRule format from Go is "3-H" (3 per hour), etc.
    const parts = limitRule.split('-');
    const maxRequests = parseInt(parts[0], 10);
    const durationType = parts[1]; // H for Hour, M for Minute, etc.

    let durationInSeconds = 3600; // default Hour
    if (durationType === 'M') durationInSeconds = 60;
    else if (durationType === 'D') durationInSeconds = 86400;

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `rate_limit:${req.path}:${ip}`;

    try {
      const current = await redisClient.incr(key);
      if (current === 1) {
        await redisClient.expire(key, durationInSeconds);
      }

      if (current > maxRequests) {
        sendError(res, 429, 'Rate limit exceeded. Please try again later.');
        return;
      }
      next();
    } catch (err) {
      console.error('Redis Rate Limiter Error:', err);
      // Fallback to allow request if Redis fails
      next();
    }
  };
};
