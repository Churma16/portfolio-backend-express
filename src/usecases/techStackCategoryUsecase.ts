import { ITechStackCategoryRepository, TechStackCategory } from '../domain/TechStackCategory';

export interface ITechStackCategoryUsecase {
  getAll(): Promise<TechStackCategory[]>;
  create(data: any): Promise<TechStackCategory>;
  update(id: number, data: any): Promise<TechStackCategory | null>;
  delete(id: number): Promise<boolean>;
}

export class TechStackCategoryUsecase implements ITechStackCategoryUsecase {
  private repo: ITechStackCategoryRepository;

  constructor(repo: ITechStackCategoryRepository) {
    this.repo = repo;
  }

  public async getAll(): Promise<TechStackCategory[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<TechStackCategory> {
    const newEntity = new TechStackCategory({
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/ /g, '-'),
      color: data.color,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }

  public async update(id: number, data: any): Promise<TechStackCategory | null> {
    return this.repo.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }
}
