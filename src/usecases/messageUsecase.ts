import { IMessageRepository, Message } from '../domain/Message';
import { getContactEmailTemplate } from '../shared/utils/emailTemplate';

export interface IMessageUsecase {
  getAll(): Promise<Message[]>;
  create(data: any): Promise<Message>;
  update(id: number, data: any): Promise<Message | null>;
  delete(id: number): Promise<boolean>;
}

import { Resend } from 'resend';

export class MessageUsecase implements IMessageUsecase {
  private repo: IMessageRepository;
  private resend: Resend;

  constructor(repo: IMessageRepository) {
    this.repo = repo;
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_123');
  }

  public async getAll(): Promise<Message[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<Message> {
    const newEntity = new Message({
      name: data.name,
      email: data.email,
      content: data.content,
      is_read: data.is_read || false,
    });
    
    newEntity.validate();
    const createdMessage = await this.repo.create(newEntity);

    // Dispatch contact notification to portfolio-notifier microservice asynchronously
    const notifierUrl = process.env.NOTIFIER_URL || 'http://portfolio-notifier:8080/api/notify';
    fetch(notifierUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.content,
        source: 'express',
      }),
      signal: AbortSignal.timeout(5000),
    }).catch((err: any) => {
      console.error('[fail] Failed to dispatch notification to portfolio-notifier:', err?.message || err);
    });

    return createdMessage;
  }


  public async update(id: number, data: any): Promise<Message | null> {
    return this.repo.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }

}
