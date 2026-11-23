import { Op } from 'sequelize';
import sequelize from '../config/database';
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
      order: [
        ['column_order', 'ASC'],
        [{ model: TechStackModel, as: 'tech_stacks' }, 'column_order', 'ASC']
      ]
    });
    return data.map((d) => new Project(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<Project | null> {
    const data = await ProjectModel.findByPk(id, {
      include: [
        { model: CategoryModel, as: 'category' },
        { model: TechStackModel, as: 'tech_stacks' },
        { model: TagModel, as: 'tags' }
      ],
      order: [
        [{ model: TechStackModel, as: 'tech_stacks' }, 'column_order', 'ASC']
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

  public async reorder(id: number, direction: 'up' | 'down'): Promise<boolean> {
    const currentProject = await ProjectModel.findByPk(id);
    if (!currentProject) {
      return false;
    }

    const currentOrder = currentProject.column_order ?? 0;
    const operator = direction === 'up' ? Op.lt : Op.gt;
    const sortOrder: 'DESC' | 'ASC' = direction === 'up' ? 'DESC' : 'ASC';

    const adjacentProject = await ProjectModel.findOne({
      where: {
        column_order: {
          [operator]: currentOrder,
        },
      },
      order: [['column_order', sortOrder]],
    });

    if (!adjacentProject) {
      return true;
    }

    const transaction = await sequelize.transaction();
    try {
      const adjacentOrder = adjacentProject.column_order;
      await ProjectModel.update(
        { column_order: adjacentOrder },
        { where: { id: currentProject.id }, transaction }
      );
      await ProjectModel.update(
        { column_order: currentOrder },
        { where: { id: adjacentProject.id }, transaction }
      );
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
