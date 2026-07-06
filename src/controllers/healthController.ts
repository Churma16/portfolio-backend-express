import { Request, Response } from 'express';
import redisClient from '../config/redis';
import { errorResponse, newSingleDataResponse, newMeta } from '../shared/utils/response';

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
      res.status(200).json({
        status: 'ok',
        redis_alive: redisAlive,
        redis_processing_time: redisProcessingTime,
      });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
