import { Request, Response } from 'express';
import { deleteCacheByPrefix } from '../shared/utils/cache';
import { errorResponse, newSingleDataResponse, newMeta } from '../shared/utils/response';

export class InternalController {
  public async invalidateCache(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-internal-token'];
    if (!token || token !== process.env.TOKEN_SYMMETRIC_KEY) {
      res.status(401).json(errorResponse(401, 'error', 'Unauthorized'));
      return;
    }

    const { prefix } = req.body;
    if (!prefix) {
      res.status(400).json(errorResponse(400, 'error', 'Prefix is required'));
      return;
    }

    try {
      await deleteCacheByPrefix(prefix);
      const meta = newMeta(200, 'success', `Cache with prefix '${prefix}' invalidated successfully`);
      res.status(200).json(newSingleDataResponse(meta, null));
    } catch (error: any) {
      res.status(500).json(errorResponse(500, 'error', error.message));
    }
  }
}
