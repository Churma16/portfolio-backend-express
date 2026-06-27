export class Tag {
  public id: number;
  public name: string;
  public slug: string;
  public color?: string;
  public category_id?: number;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.color = data.color;
    this.category_id = data.category_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public validate(): void {
    // Add domain validation logic here
  }
}

export interface ITagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: number): Promise<Tag | null>;
  create(data: Tag): Promise<Tag>;
  update(id: number, data: Partial<Tag>): Promise<Tag | null>;
  delete(id: number): Promise<boolean>;
}
