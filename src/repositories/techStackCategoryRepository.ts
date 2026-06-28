import { TechStackCategoryModel } from '../models/TechStackCategoryModel';
import { TechStackCategory, ITechStackCategoryRepository } from '../domain/TechStackCategory';

export class TechStackCategoryRepository implements ITechStackCategoryRepository {
  public async findAll(): Promise<TechStackCategory[]> {
    const data = await TechStackCategoryModel.findAll();
    return data.map((d) => new TechStackCategory(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<TechStackCategory | null> {
    const data = await TechStackCategoryModel.findByPk(id);
    if (!data) return null;
    return new TechStackCategory(data.get({ plain: true }));
  }

  public async create(entity: TechStackCategory): Promise<TechStackCategory> {
    const data = await TechStackCategoryModel.create({
      name: entity.name,
      slug: entity.slug,
      color: entity.color,
    });
    return new TechStackCategory(data.get({ plain: true }));
  }

  public async update(id: number, data: Partial<TechStackCategory>): Promise<TechStackCategory | null> {
    await TechStackCategoryModel.update(data, { where: { id } as any });
    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await TechStackCategoryModel.destroy({ where: { id } as any });
    return deleted > 0;
  }
}
