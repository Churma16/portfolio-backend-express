import { Request, Response } from 'express';
import { IWorkExperienceUsecase } from '../usecases/workExperienceUsecase';
import { newMeta, newMultipleDataResponse, newSingleDataResponse, errorResponse } from '../shared/utils/response';
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
        const meta = newMeta(200, 'success', 'WorkExperience retrieved successfully');
        res.status(200).json(newMultipleDataResponse(meta, JSON.parse(cached)));
        return;
      }

      const data = await this.usecase.getAll();
      await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);

      const meta = newMeta(200, 'success', 'WorkExperience retrieved successfully');
      res.status(200).json(newMultipleDataResponse(meta, data));
    } catch (error: any) {
      res.status(500).json(errorResponse(500, 'error', error.message));
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.create(req.body);
      await deleteCacheByPrefix('workExperiences:');

      const meta = newMeta(201, 'success', 'WorkExperience created successfully');
      res.status(201).json(newSingleDataResponse(meta, data));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const cacheKey = `workExperiences:${id}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        const meta = newMeta(200, 'success', 'WorkExperience retrieved successfully');
        res.status(200).json(newSingleDataResponse(meta, JSON.parse(cached)));
        return;
      }

      const data = await this.usecase.getAll().then(all => all.find(x => (x as any).id === id) || null); 
      if (data) {
        await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
      }

      const meta = newMeta(200, 'success', 'WorkExperience retrieved successfully');
      res.status(200).json(newSingleDataResponse(meta, data));
    } catch (error: any) {
      res.status(500).json(errorResponse(500, 'error', error.message));
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await this.usecase.update(id, req.body);
      await deleteCacheByPrefix('workExperiences:');

      const meta = newMeta(200, 'success', 'WorkExperience updated successfully');
      res.status(200).json(newSingleDataResponse(meta, data));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      await this.usecase.delete(id);
      await deleteCacheByPrefix('workExperiences:');

      const meta = newMeta(200, 'success', 'WorkExperience deleted successfully');
      res.status(200).json(newSingleDataResponse(meta, null));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }

  public async reorder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { column_order } = req.body;
      await this.usecase.reorder(id, column_order);
      await deleteCacheByPrefix('workExperiences:');

      const meta = newMeta(200, 'success', 'WorkExperience reordered successfully');
      res.status(200).json(newSingleDataResponse(meta, null));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }
}
