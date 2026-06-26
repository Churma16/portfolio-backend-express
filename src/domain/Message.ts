export class Message {
  public id: number;
  public name: string;
  public email: string;
  public content: string;
  public is_read?: boolean;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.content = data.content;
    this.is_read = data.is_read;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public validate(): void {
    // Add domain validation logic here
  }
}

export interface IMessageRepository {
  findAll(): Promise<Message[]>;
  findById(id: number): Promise<Message | null>;
  create(data: Message): Promise<Message>;
}
