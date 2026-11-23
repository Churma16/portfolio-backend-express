import { Op } from 'sequelize';
import sequelize from '../config/database';
import { WorkExperienceModel } from '../models/WorkExperienceModel';
import { WorkExperience, IWorkExperienceRepository } from '../domain/WorkExperience';

import { TechStackModel } from '../models/TechStackModel';
import { TagModel } from '../models/TagModel';

export class WorkExperienceRepository implements IWorkExperienceRepository {
  public async findAll(): Promise<WorkExperience[]> {
    const data = await WorkExperienceModel.findAll({
      include: [
        { model: TechStackModel, as: 'tech_stacks' },
        { model: TagModel, as: 'tags' }
      ],
      order: [
        ['column_order', 'ASC'],
        [{ model: TechStackModel, as: 'tech_stacks' }, 'column_order', 'ASC']
      ]
    });
    return data.map((d) => new WorkExperience(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<WorkExperience | null> {
    const data = await WorkExperienceModel.findByPk(id, {
      include: [
        { model: TechStackModel, as: 'tech_stacks' },
        { model: TagModel, as: 'tags' }
      ],
      order: [
        [{ model: TechStackModel, as: 'tech_stacks' }, 'column_order', 'ASC']
      ]
    });
    if (!data) return null;
    return new WorkExperience(data.get({ plain: true }));
  }

  public async create(entity: WorkExperience): Promise<WorkExperience> {
    const data = await WorkExperienceModel.create({
      company: entity.company,
      position: entity.position,
      location: entity.location,
      start_date: entity.start_date,
      end_date: entity.end_date,
      is_current: entity.is_current,
      description: entity.description,
      column_order: entity.column_order,
      achievements: entity.achievements,
    });
    return new WorkExperience(data.get({ plain: true }));
  }


  public async update(id: number, data: Partial<WorkExperience>): Promise<WorkExperience | null> {
    await WorkExperienceModel.update(data, { where: { id } as any });
    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await WorkExperienceModel.destroy({ where: { id } as any });
    return deleted > 0;
  }

  public async reorder(id: number, direction: 'up' | 'down'): Promise<boolean> {
    const currentWorkExperience = await WorkExperienceModel.findByPk(id);
    if (!currentWorkExperience) {
      return false;
    }

    const currentOrder = currentWorkExperience.column_order ?? 0;
    const operator = direction === 'up' ? Op.lt : Op.gt;
    const sortOrder: 'DESC' | 'ASC' = direction === 'up' ? 'DESC' : 'ASC';

    const adjacentWorkExperience = await WorkExperienceModel.findOne({
      where: {
        column_order: {
          [operator]: currentOrder,
        },
      },
      order: [['column_order', sortOrder]],
    });

    if (!adjacentWorkExperience) {
      return true;
    }

    const transaction = await sequelize.transaction();
    try {
      const adjacentOrder = adjacentWorkExperience.column_order;
      await WorkExperienceModel.update(
        { column_order: adjacentOrder },
        { where: { id: currentWorkExperience.id }, transaction }
      );
      await WorkExperienceModel.update(
        { column_order: currentOrder },
        { where: { id: adjacentWorkExperience.id }, transaction }
      );
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
