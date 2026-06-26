import { TechStackModel } from '../models/TechStackModel';
import { TechStack, ITechStackRepository } from '../domain/TechStack';

export class TechStackRepository implements ITechStackRepository {
  public async findAll(): Promise<TechStack[]> {
    const data = await TechStackModel.findAll();
    return data.map((d) => new TechStack(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<TechStack | null> {
    const data = await TechStackModel.findByPk(id);
    if (!data) return null;
    return new TechStack(data.get({ plain: true }));
  }

  public async create(entity: TechStack): Promise<TechStack> {
    const data = await TechStackModel.create({
      name: entity.name,
      slug: entity.slug,
      icon: entity.icon,
      column_order: entity.column_order,
    });
    return new TechStack(data.get({ plain: true }));
  }
}
