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
    this.resend = new Resend(process.env.RESEND_API_KEY);
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

    // Send email notification asynchronously
    if (process.env.RESEND_API_KEY) {
      const emailHtml = getContactEmailTemplate({
        name: data.name,
        email: data.email,
        content: data.content
      });

      this.resend.emails.send({
        from: `Portfolio Contact <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`, 
        to: process.env.MY_EMAIL || 'fathan@example.com', 
        subject: `[Pesan Baru]: ${data.name}`,
        html: emailHtml,
        replyTo: data.email,
      }).catch(err => {
        console.error('Failed to send email via Resend:', err);
      });
    }

    return createdMessage;
  }


  public async update(id: number, data: any): Promise<Message | null> {
    return this.repo.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }

}
