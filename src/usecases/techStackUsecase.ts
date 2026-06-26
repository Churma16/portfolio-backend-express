import { ITechStackRepository, TechStack } from '../domain/TechStack';

export interface ITechStackUsecase {
  getAll(): Promise<TechStack[]>;
  create(data: any): Promise<TechStack>;
}

export class TechStackUsecase implements ITechStackUsecase {
  private repo: ITechStackRepository;

  constructor(repo: ITechStackRepository) {
    this.repo = repo;
  }

  public async getAll(): Promise<TechStack[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<TechStack> {
    const newEntity = new TechStack({
      name: data.name,
      slug: data.slug,
      icon: data.icon,
      column_order: data.column_order,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }
}
