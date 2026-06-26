import { TagModel } from '../models/TagModel';
import { Tag, ITagRepository } from '../domain/Tag';

export class TagRepository implements ITagRepository {
  public async findAll(): Promise<Tag[]> {
    const data = await TagModel.findAll();
    return data.map((d) => new Tag(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<Tag | null> {
    const data = await TagModel.findByPk(id);
    if (!data) return null;
    return new Tag(data.get({ plain: true }));
  }

  public async create(entity: Tag): Promise<Tag> {
    const data = await TagModel.create({
      name: entity.name,
      slug: entity.slug,
      color: entity.color,
      category_id: entity.category_id,
    });
    return new Tag(data.get({ plain: true }));
  }
}
