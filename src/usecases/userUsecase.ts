import bcrypt from 'bcryptjs';
import { IUserRepository, User } from '../domain/User';
import { generateToken } from '../shared/utils/jwt';

export interface IUserUsecase {
  getAll(): Promise<User[]>;
  create(data: any): Promise<User>;
  update(id: number, data: any): Promise<User | null>;
  delete(id: number): Promise<boolean>;
  login(email: string, password: string): Promise<{ token: string; email: string }>;
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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const newEntity = new User({
      email: data.email,
      password: hashedPassword,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }

  public async login(email: string, password: string): Promise<{ token: string; email: string }> {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user.id, user.email);
    return { token, email: user.email };
  }

  public async update(id: number, data: any): Promise<User | null> {
    return this.repo.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }

}
