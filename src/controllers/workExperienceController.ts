import { Request, Response } from 'express';
import { IWorkExperienceUsecase } from '../usecases/workExperienceUsecase';
import { newMeta, newMultipleDataResponse, newSingleDataResponse, errorResponse } from '../shared/utils/response';

export class WorkExperienceController {
  private usecase: IWorkExperienceUsecase;

  constructor(usecase: IWorkExperienceUsecase) {
    this.usecase = usecase;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.getAll();
      const meta = newMeta(200, 'success', 'WorkExperience retrieved successfully');
      res.status(200).json(newMultipleDataResponse(meta, data));
    } catch (error: any) {
      res.status(500).json(errorResponse(500, 'error', error.message));
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.create(req.body);
      const meta = newMeta(201, 'success', 'WorkExperience created successfully');
      res.status(201).json(newSingleDataResponse(meta, data));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }
}
