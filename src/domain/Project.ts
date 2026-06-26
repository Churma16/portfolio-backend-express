export class Project {
  public id?: string;
  public title: string;
  public description: string;
  public url: string;

  constructor(data: { id?: string; title: string; description: string; url: string }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.url = data.url;
  }

  // Business logic related to Project
  public validate(): void {
    if (!this.title || this.title.length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }
  }
}

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(project: Project): Promise<Project>;
}
