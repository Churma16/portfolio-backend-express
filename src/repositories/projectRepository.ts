import { ProjectModel } from '../models/ProjectModel';
import { Project, IProjectRepository } from '../domain/Project';

export class ProjectRepository implements IProjectRepository {
  public async findAll(): Promise<Project[]> {
    const data = await ProjectModel.findAll();
    return data.map((d) => new Project(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<Project | null> {
    const data = await ProjectModel.findByPk(id);
    if (!data) return null;
    return new Project(data.get({ plain: true }));
  }

  public async create(project: Project): Promise<Project> {
    const data = await ProjectModel.create({
      title: project.title,
      slug: project.slug,
      thumbnail: project.thumbnail,
      content: project.content,
      demo_url: project.demo_url,
      repo_url: project.repo_url,
      is_featured: project.is_featured,
      published_at: project.published_at,
      category_id: project.category_id,
    });
    return new Project(data.get({ plain: true }));
  }
}
