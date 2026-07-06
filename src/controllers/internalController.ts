import { Request, Response } from 'express';
import { deleteCacheByPrefix } from '../shared/utils/cache';
import { sendSuccess, sendError } from '../shared/utils/response';

export class InternalController {
  public async invalidateCache(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-internal-token'];
    if (!token || token !== process.env.TOKEN_SYMMETRIC_KEY) {
      sendError(res, 401, 'Unauthorized');
      return;
    }

    const { prefix } = req.body;
    if (!prefix) {
      sendError(res, 400, 'Prefix is required');
      return;
    }

    try {
      await deleteCacheByPrefix(prefix);
      sendSuccess(res, 200, `Cache with prefix '${prefix}' invalidated successfully`, null);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
}
