export class TechStack {
  public id: number;
  public name: string;
  public slug: string;
  public icon?: string;
  public column_order?: number;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.icon = data.icon;
    this.column_order = data.column_order;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public validate(): void {
    // Add domain validation logic here
  }
}

export interface ITechStackRepository {
  findAll(): Promise<TechStack[]>;
  findById(id: number): Promise<TechStack | null>;
  create(data: TechStack): Promise<TechStack>;
  update(id: number, data: Partial<TechStack>): Promise<TechStack | null>;
  delete(id: number): Promise<boolean>;
  reorder(id: number, order: number): Promise<boolean>;
}
