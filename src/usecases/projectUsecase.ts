import { IProjectRepository, Project } from '../domain/Project';

export interface IProjectUsecase {
  getAll(): Promise<Project[]>;
  create(data: any): Promise<Project>;
  update(id: number, data: any): Promise<Project | null>;
  delete(id: number): Promise<boolean>;
  reorder(id: number, order: number): Promise<boolean>;
}

export class ProjectUsecase implements IProjectUsecase {
  private projectRepo: IProjectRepository;

  constructor(projectRepo: IProjectRepository) {
    this.projectRepo = projectRepo;
  }

  public async getAll(): Promise<Project[]> {
    return this.projectRepo.findAll();
  }

  public async create(data: any): Promise<Project> {
    const newProject = new Project({
      title: data.title,
      slug: data.slug,
      thumbnail: data.thumbnail,
      content: data.content,
      demo_url: data.demo_url,
      repo_url: data.repo_url,
      is_featured: data.is_featured,
      published_at: data.published_at,
      category_id: data.category_id,
    });
    
    // Domain logic validation
    newProject.validate();

    return this.projectRepo.create(newProject);
  }


  public async update(id: number, data: any): Promise<Project | null> {
    return this.projectRepo.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.projectRepo.delete(id);
  }

  public async reorder(id: number, order: number): Promise<boolean> {
    return this.projectRepo.reorder(id, order);
  }
}
