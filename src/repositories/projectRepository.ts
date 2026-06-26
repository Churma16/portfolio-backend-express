import { ProjectModel } from '../models/ProjectModel';
import { Project, IProjectRepository } from '../domain/Project';

export class ProjectRepository implements IProjectRepository {
  public async findAll(): Promise<Project[]> {
    const data = await ProjectModel.findAll();
    // Translate Sequelize models to pure TS Domain classes
    return data.map((d) => new Project(d.get({ plain: true })));
  }

  public async findById(id: string): Promise<Project | null> {
    const data = await ProjectModel.findByPk(id);
    if (!data) return null;
    return new Project(data.get({ plain: true }));
  }

  public async create(project: Project): Promise<Project> {
    const data = await ProjectModel.create({
      title: project.title,
      description: project.description,
      url: project.url,
    });
    return new Project(data.get({ plain: true }));
  }
}
