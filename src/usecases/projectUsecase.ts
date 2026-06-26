import { IProjectRepository, Project } from '../domain/Project';

export interface IProjectUsecase {
  getAllProjects(): Promise<Project[]>;
  createProject(data: { title: string; description: string; url: string }): Promise<Project>;
}

export class ProjectUsecase implements IProjectUsecase {
  private projectRepo: IProjectRepository;

  constructor(projectRepo: IProjectRepository) {
    this.projectRepo = projectRepo;
  }

  public async getAllProjects(): Promise<Project[]> {
    return this.projectRepo.findAll();
  }

  public async createProject(data: { title: string; description: string; url: string }): Promise<Project> {
    const newProject = new Project({
      title: data.title,
      description: data.description,
      url: data.url,
    });
    
    // Domain logic validation
    newProject.validate();

    return this.projectRepo.create(newProject);
  }
}
