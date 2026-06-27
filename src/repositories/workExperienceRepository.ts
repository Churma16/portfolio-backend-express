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
      order: [['column_order', 'ASC']]
    });
    return data.map((d) => new WorkExperience(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<WorkExperience | null> {
    const data = await WorkExperienceModel.findByPk(id, {
      include: [
        { model: TechStackModel, as: 'tech_stacks' },
        { model: TagModel, as: 'tags' }
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

  public async reorder(id: number, order: number): Promise<boolean> {
    const updated = await WorkExperienceModel.update({ column_order: order } as any, { where: { id } as any });
    return updated[0] > 0;
  }
}
