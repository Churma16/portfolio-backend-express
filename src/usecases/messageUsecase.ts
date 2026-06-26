import { IMessageRepository, Message } from '../domain/Message';

export interface IMessageUsecase {
  getAll(): Promise<Message[]>;
  create(data: any): Promise<Message>;
}

export class MessageUsecase implements IMessageUsecase {
  private repo: IMessageRepository;

  constructor(repo: IMessageRepository) {
    this.repo = repo;
  }

  public async getAll(): Promise<Message[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<Message> {
    const newEntity = new Message({
      name: data.name,
      email: data.email,
      content: data.content,
      is_read: data.is_read,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }
}
