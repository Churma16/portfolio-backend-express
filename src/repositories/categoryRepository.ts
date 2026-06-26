import { CategoryModel } from '../models/CategoryModel';
import { Category, ICategoryRepository } from '../domain/Category';

export class CategoryRepository implements ICategoryRepository {
  public async findAll(): Promise<Category[]> {
    const data = await CategoryModel.findAll();
    return data.map((d) => new Category(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<Category | null> {
    const data = await CategoryModel.findByPk(id);
    if (!data) return null;
    return new Category(data.get({ plain: true }));
  }

  public async create(entity: Category): Promise<Category> {
    const data = await CategoryModel.create({
      name: entity.name,
      slug: entity.slug,
      color: entity.color,
    });
    return new Category(data.get({ plain: true }));
  }
}
