import { UserModel } from '../models/UserModel';
import { User, IUserRepository } from '../domain/User';

export class UserRepository implements IUserRepository {
  public async findAll(): Promise<User[]> {
    const data = await UserModel.findAll();
    return data.map((d) => new User(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<User | null> {
    const data = await UserModel.findByPk(id);
    if (!data) return null;
    return new User(data.get({ plain: true }));
  }

  public async findByEmail(email: string): Promise<User | null> {
    const data = await UserModel.findOne({ where: { email } });
    if (!data) return null;
    return new User(data.get({ plain: true }));
  }

  public async create(entity: User): Promise<User> {
    const data = await UserModel.create({
      email: entity.email,
      password: entity.password,
    });
    return new User(data.get({ plain: true }));
  }


  public async update(id: number, data: Partial<User>): Promise<User | null> {
    await UserModel.update(data, { where: { id } as any });
    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await UserModel.destroy({ where: { id } as any });
    return deleted > 0;
  }

}
