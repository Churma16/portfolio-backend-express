import { IProjectRepository, Project } from '../domain/Project';

export interface IProjectUsecase {
  getAllProjects(): Promise<Project[]>;
  createProject(data: any): Promise<Project>;
}

export class ProjectUsecase implements IProjectUsecase {
  private projectRepo: IProjectRepository;

  constructor(projectRepo: IProjectRepository) {
    this.projectRepo = projectRepo;
  }

  public async getAllProjects(): Promise<Project[]> {
    return this.projectRepo.findAll();
  }

  public async createProject(data: any): Promise<Project> {
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
}
