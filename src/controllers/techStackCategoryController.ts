import { Request, Response } from 'express';
import { ITechStackCategoryUsecase } from '../usecases/techStackCategoryUsecase';
import { sendSuccess, sendError } from '../shared/utils/response';
import redisClient from '../config/redis';
import { deleteCacheByPrefix } from '../shared/utils/cache';

export class TechStackCategoryController {
  private usecase: ITechStackCategoryUsecase;

  constructor(usecase: ITechStackCategoryUsecase) {
    this.usecase = usecase;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const cacheKey = 'tech_stack_categories:all';
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        sendSuccess(res, 200, 'TechStackCategory retrieved successfully', JSON.parse(cached));
        return;
      }

      const data = await this.usecase.getAll();
      await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);

      sendSuccess(res, 200, 'TechStackCategory retrieved successfully', data);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.create(req.body);
      await deleteCacheByPrefix('tech_stack_categories:');
      await deleteCacheByPrefix('tech_stacks:'); // Clear tech stacks cache as well

      sendSuccess(res, 201, 'TechStackCategory created successfully', data);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const cacheKey = `tech_stack_categories:${id}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        sendSuccess(res, 200, 'TechStackCategory retrieved successfully', JSON.parse(cached));
        return;
      }

      const data = await this.usecase.getAll().then(all => all.find(x => (x as any).id === id) || null); 
      if (data) {
        await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
      }

      sendSuccess(res, 200, 'TechStackCategory retrieved successfully', data);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await this.usecase.update(id, req.body);
      await deleteCacheByPrefix('tech_stack_categories:');
      await deleteCacheByPrefix('tech_stacks:');

      sendSuccess(res, 200, 'TechStackCategory updated successfully', data);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      await this.usecase.delete(id);
      await deleteCacheByPrefix('tech_stack_categories:');
      await deleteCacheByPrefix('tech_stacks:');

      sendSuccess(res, 200, 'TechStackCategory deleted successfully', null);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }
}
