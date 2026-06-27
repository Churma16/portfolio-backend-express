import { IUserRepository, User } from '../domain/User';

export interface IUserUsecase {
  getAll(): Promise<User[]>;
  create(data: any): Promise<User>;
  update(id: number, data: any): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}

export class UserUsecase implements IUserUsecase {
  private repo: IUserRepository;

  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  public async getAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<User> {
    const newEntity = new User({
      email: data.email,
      password: data.password,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }


  public async update(id: number, data: any): Promise<User | null> {
    return this.repo.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }

}
