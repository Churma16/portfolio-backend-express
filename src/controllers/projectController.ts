import { Request, Response } from 'express';
import { IProjectUsecase } from '../usecases/projectUsecase';
import { newMeta, newMultipleDataResponse, newSingleDataResponse, errorResponse } from '../shared/utils/response';
import redisClient from '../config/redis';
import { deleteCacheByPrefix } from '../shared/utils/cache';

export class ProjectController {
  private usecase: IProjectUsecase;

  constructor(usecase: IProjectUsecase) {
    this.usecase = usecase;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const cacheKey = 'projects:all';
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        const meta = newMeta(200, 'success', 'Project retrieved successfully');
        res.status(200).json(newMultipleDataResponse(meta, JSON.parse(cached)));
        return;
      }

      const data = await this.usecase.getAll();
      await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);

      const meta = newMeta(200, 'success', 'Project retrieved successfully');
      res.status(200).json(newMultipleDataResponse(meta, data));
    } catch (error: any) {
      res.status(500).json(errorResponse(500, 'error', error.message));
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.create(req.body);
      await deleteCacheByPrefix('projects:');

      const meta = newMeta(201, 'success', 'Project created successfully');
      res.status(201).json(newSingleDataResponse(meta, data));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const cacheKey = `projects:${id}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        const meta = newMeta(200, 'success', 'Project retrieved successfully');
        res.status(200).json(newSingleDataResponse(meta, JSON.parse(cached)));
        return;
      }

      const data = await this.usecase.getAll().then(all => all.find(x => (x as any).id === id) || null); 
      if (data) {
        await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
      }

      const meta = newMeta(200, 'success', 'Project retrieved successfully');
      res.status(200).json(newSingleDataResponse(meta, data));
    } catch (error: any) {
      res.status(500).json(errorResponse(500, 'error', error.message));
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await this.usecase.update(id, req.body);
      await deleteCacheByPrefix('projects:');

      const meta = newMeta(200, 'success', 'Project updated successfully');
      res.status(200).json(newSingleDataResponse(meta, data));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      await this.usecase.delete(id);
      await deleteCacheByPrefix('projects:');

      const meta = newMeta(200, 'success', 'Project deleted successfully');
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
      await deleteCacheByPrefix('projects:');

      const meta = newMeta(200, 'success', 'Project reordered successfully');
      res.status(200).json(newSingleDataResponse(meta, null));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }
}
