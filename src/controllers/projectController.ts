import { Request, Response } from 'express';
import { IProjectUsecase } from '../usecases/projectUsecase';
import { newMeta, newMultipleDataResponse, newSingleDataResponse, errorResponse } from '../shared/utils/response';

export class ProjectController {
  private projectUsecase: IProjectUsecase;

  constructor(projectUsecase: IProjectUsecase) {
    this.projectUsecase = projectUsecase;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectUsecase.getAllProjects();
      const meta = newMeta(200, 'success', 'Projects retrieved successfully');
      res.status(200).json(newMultipleDataResponse(meta, projects));
    } catch (error: any) {
      res.status(500).json(errorResponse(500, 'error', error.message));
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newProject = await this.projectUsecase.createProject(req.body);
      const meta = newMeta(201, 'success', 'Project created successfully');
      res.status(201).json(newSingleDataResponse(meta, newProject));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }
}
