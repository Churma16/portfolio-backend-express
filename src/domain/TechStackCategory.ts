export class TechStackCategory {
  public id: number;
  public name: string;
  public slug: string;
  public color?: string;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.color = data.color;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public validate(): void {
    // Add domain validation logic here
  }
}

export interface ITechStackCategoryRepository {
  findAll(): Promise<TechStackCategory[]>;
  findById(id: number): Promise<TechStackCategory | null>;
  create(data: TechStackCategory): Promise<TechStackCategory>;
  update(id: number, data: Partial<TechStackCategory>): Promise<TechStackCategory | null>;
  delete(id: number): Promise<boolean>;
}
