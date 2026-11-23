import { Request, Response } from 'express';
import { deleteCacheByPrefix } from '../shared/utils/cache';
import { newSingleDataResponse, newMeta, errorResponse } from '../shared/utils/response';

const APPLICATION_CACHE_PREFIXES = [
  'categories:',
  'site_profile',
  'projects:',
  'tags:',
  'tech_stacks:',
  'tech_stack_categories:',
  'workExperiences:',
];

export class CacheController {
  public async flush(req: Request, res: Response): Promise<void> {
    const { prefix = 'all' } = req.body;

    try {
      if (prefix === 'all' || !prefix) {
        for (const targetPrefix of APPLICATION_CACHE_PREFIXES) {
          await deleteCacheByPrefix(targetPrefix);
        }
      } else {
        await deleteCacheByPrefix(prefix);
      }

      const meta = newMeta(200, 'success', 'Express cache flushed successfully');
      res.status(200).json(newSingleDataResponse(meta, {
        backend: 'express',
        flushed_at: new Date().toISOString(),
      }));
    } catch (error: any) {
      res.status(500).json(errorResponse(500, 'error', error.message));
    }
  }
}
