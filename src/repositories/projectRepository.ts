import { ProjectModel } from '../models/ProjectModel';
import { Project, IProjectRepository } from '../domain/Project';

import { TechStackModel } from '../models/TechStackModel';
import { TagModel } from '../models/TagModel';
import { CategoryModel } from '../models/CategoryModel';

export class ProjectRepository implements IProjectRepository {
  public async findAll(): Promise<Project[]> {
    const data = await ProjectModel.findAll({
      include: [
        { model: CategoryModel, as: 'category' },
        { model: TechStackModel, as: 'tech_stacks' },
        { model: TagModel, as: 'tags' }
      ],
      order: [['column_order', 'ASC']]
    });
    return data.map((d) => new Project(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<Project | null> {
    const data = await ProjectModel.findByPk(id, {
      include: [
        { model: CategoryModel, as: 'category' },
        { model: TechStackModel, as: 'tech_stacks' },
        { model: TagModel, as: 'tags' }
      ]
    });
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


  public async update(id: number, data: Partial<Project>): Promise<Project | null> {
    await ProjectModel.update(data, { where: { id } as any });
    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await ProjectModel.destroy({ where: { id } as any });
    return deleted > 0;
  }

  public async reorder(id: number, order: number): Promise<boolean> {
    const updated = await ProjectModel.update({ column_order: order } as any, { where: { id } as any });
    return updated[0] > 0;
  }
}
