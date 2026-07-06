import { Request, Response } from 'express';
import { IWorkExperienceUsecase } from '../usecases/workExperienceUsecase';
import { sendSuccess, sendError } from '../shared/utils/response';
import redisClient from '../config/redis';
import { deleteCacheByPrefix } from '../shared/utils/cache';

export class WorkExperienceController {
  private usecase: IWorkExperienceUsecase;

  constructor(usecase: IWorkExperienceUsecase) {
    this.usecase = usecase;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const cacheKey = 'workExperiences:all';
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        sendSuccess(res, 200, 'WorkExperience retrieved successfully', JSON.parse(cached));
        return;
      }

      const data = await this.usecase.getAll();
      await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);

      sendSuccess(res, 200, 'WorkExperience retrieved successfully', data);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.create(req.body);
      await deleteCacheByPrefix('workExperiences:');

      sendSuccess(res, 201, 'WorkExperience created successfully', data);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const cacheKey = `workExperiences:${id}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        sendSuccess(res, 200, 'WorkExperience retrieved successfully', JSON.parse(cached));
        return;
      }

      const data = await this.usecase.getAll().then(all => all.find(x => (x as any).id === id) || null); 
      if (data) {
        await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
      }

      sendSuccess(res, 200, 'WorkExperience retrieved successfully', data);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await this.usecase.update(id, req.body);
      await deleteCacheByPrefix('workExperiences:');

      sendSuccess(res, 200, 'WorkExperience updated successfully', data);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      await this.usecase.delete(id);
      await deleteCacheByPrefix('workExperiences:');

      sendSuccess(res, 200, 'WorkExperience deleted successfully', null);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  public async reorder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { column_order } = req.body;
      await this.usecase.reorder(id, column_order);
      await deleteCacheByPrefix('workExperiences:');

      sendSuccess(res, 200, 'WorkExperience reordered successfully', null);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }
}
