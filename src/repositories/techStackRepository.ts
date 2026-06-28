import { TechStackModel } from '../models/TechStackModel';
import { TechStack, ITechStackRepository } from '../domain/TechStack';

export class TechStackRepository implements ITechStackRepository {
  public async findAll(): Promise<TechStack[]> {
    const data = await TechStackModel.findAll({
      order: [['column_order', 'ASC']]
    });
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
      tech_stack_category_id: entity.tech_stack_category_id,
    });
    return new TechStack(data.get({ plain: true }));
  }


  public async update(id: number, data: Partial<TechStack>): Promise<TechStack | null> {
    await TechStackModel.update(data, { where: { id } as any });
    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await TechStackModel.destroy({ where: { id } as any });
    return deleted > 0;
  }

  public async reorder(id: number, order: number): Promise<boolean> {
    const updated = await TechStackModel.update({ column_order: order } as any, { where: { id } as any });
    return updated[0] > 0;
  }
}
