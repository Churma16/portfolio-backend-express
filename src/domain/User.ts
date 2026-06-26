export class User {
  public id: number;
  public email: string;
  public password: string;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public validate(): void {
    // Add domain validation logic here
  }
}

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  create(data: User): Promise<User>;
}
