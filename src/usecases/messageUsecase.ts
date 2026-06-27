import { IMessageRepository, Message } from '../domain/Message';

export interface IMessageUsecase {
  getAll(): Promise<Message[]>;
  create(data: any): Promise<Message>;
  update(id: number, data: any): Promise<Message | null>;
  delete(id: number): Promise<boolean>;
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


  public async update(id: number, data: any): Promise<Message | null> {
    return this.repo.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }

}
