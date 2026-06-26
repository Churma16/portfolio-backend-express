import { ICategoryRepository, Category } from '../domain/Category';

export interface ICategoryUsecase {
  getAll(): Promise<Category[]>;
  create(data: any): Promise<Category>;
}

export class CategoryUsecase implements ICategoryUsecase {
  private repo: ICategoryRepository;

  constructor(repo: ICategoryRepository) {
    this.repo = repo;
  }

  public async getAll(): Promise<Category[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<Category> {
    const newEntity = new Category({
      name: data.name,
      slug: data.slug,
      color: data.color,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }
}
