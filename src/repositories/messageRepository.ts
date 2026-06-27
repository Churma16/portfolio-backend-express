import { MessageModel } from '../models/MessageModel';
import { Message, IMessageRepository } from '../domain/Message';

export class MessageRepository implements IMessageRepository {
  public async findAll(): Promise<Message[]> {
    const data = await MessageModel.findAll();
    return data.map((d) => new Message(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<Message | null> {
    const data = await MessageModel.findByPk(id);
    if (!data) return null;
    return new Message(data.get({ plain: true }));
  }

  public async create(entity: Message): Promise<Message> {
    const data = await MessageModel.create({
      name: entity.name,
      email: entity.email,
      content: entity.content,
      is_read: entity.is_read,
    });
    return new Message(data.get({ plain: true }));
  }


  public async update(id: number, data: Partial<Message>): Promise<Message | null> {
    await MessageModel.update(data, { where: { id } as any });
    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await MessageModel.destroy({ where: { id } as any });
    return deleted > 0;
  }

}
