export class Project {
  public id?: number;
  public title: string;
  public slug: string;
  public thumbnail?: string;
  public content?: string;
  public demo_url?: string;
  public repo_url?: string;
  public is_featured?: boolean;
  public published_at?: Date;
  public column_order?: number;
  public category_id?: number;
  public created_at?: Date;
  public updated_at?: Date;

  public tech_stack?: any[];
  public tags?: any[];
  public category?: any;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.slug = data.slug;
    this.thumbnail = data.thumbnail;
    this.content = data.content;
    this.demo_url = data.demo_url;
    this.repo_url = data.repo_url;
    this.is_featured = data.is_featured;
    this.published_at = data.published_at;
    this.column_order = data.column_order;
    this.category_id = data.category_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.tech_stack = data.tech_stacks || data.tech_stack || data.techStacks;
    this.tags = data.tags;
    this.category = data.category;
  }

  public validate(): void {
    if (!this.title || this.title.length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }
    if (!this.slug) {
      throw new Error('Slug is required');
    }
  }
}

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: number): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(id: number, data: Partial<Project>): Promise<Project | null>;
  delete(id: number): Promise<boolean>;
  reorder(id: number, direction: 'up' | 'down'): Promise<boolean>;
}
