import { Request, Response } from 'express';
import redisClient from '../config/redis';
import { sendSuccess, sendError } from '../shared/utils/response';

export class HealthController {
  public async check(req: Request, res: Response): Promise<void> {
    try {
      const startRedis = performance.now();
      let redisAlive = false;
      try {
        await redisClient.ping();
        redisAlive = true;
      } catch (err) {
        redisAlive = false;
      }
      const endRedis = performance.now();
      const redisProcessingTime = Number((endRedis - startRedis).toFixed(2));

      sendSuccess(res, 200, 'Health check ok', {
        redis_alive: redisAlive,
        redis_processing_time: redisProcessingTime,
      });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
}
