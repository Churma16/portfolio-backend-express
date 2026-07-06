import { Request, Response } from 'express';
import { IMessageUsecase } from '../usecases/messageUsecase';
import { sendSuccess, sendError } from '../shared/utils/response';

export class MessageController {
  private usecase: IMessageUsecase;

  constructor(usecase: IMessageUsecase) {
    this.usecase = usecase;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.getAll();
      sendSuccess(res, 200, 'Message retrieved successfully', data);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.create(req.body);
      sendSuccess(res, 201, 'Message created successfully', data);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }


  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await this.usecase.getAll().then(all => all.find(x => (x as any).id === id) || null); // quick fallback, best if we add getById to usecase
      sendSuccess(res, 200, 'Message retrieved successfully', data);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await this.usecase.update(id, req.body);
      sendSuccess(res, 200, 'Message updated successfully', data);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      await this.usecase.delete(id);
      sendSuccess(res, 200, 'Message deleted successfully', null);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

}
