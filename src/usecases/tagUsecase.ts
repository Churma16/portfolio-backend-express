import { ITagRepository, Tag } from '../domain/Tag';

export interface ITagUsecase {
  getAll(): Promise<Tag[]>;
  create(data: any): Promise<Tag>;
  update(id: number, data: any): Promise<Tag | null>;
  delete(id: number): Promise<boolean>;
}

export class TagUsecase implements ITagUsecase {
  private repo: ITagRepository;

  constructor(repo: ITagRepository) {
    this.repo = repo;
  }

  public async getAll(): Promise<Tag[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<Tag> {
    const newEntity = new Tag({
      name: data.name,
      slug: data.slug,
      color: data.color,
      category_id: data.category_id,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }


  public async update(id: number, data: any): Promise<Tag | null> {
    return this.repo.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }

}
