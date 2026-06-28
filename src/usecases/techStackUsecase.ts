import { ITechStackRepository, TechStack } from '../domain/TechStack';

export interface ITechStackUsecase {
  getAll(): Promise<TechStack[]>;
  create(data: any): Promise<TechStack>;
  update(id: number, data: any): Promise<TechStack | null>;
  delete(id: number): Promise<boolean>;
  reorder(id: number, order: number): Promise<boolean>;
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
      tech_stack_category_id: data.tech_stack_category_id,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }


  public async update(id: number, data: any): Promise<TechStack | null> {
    return this.repo.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }

  public async reorder(id: number, order: number): Promise<boolean> {
    return this.repo.reorder(id, order);
  }
}
