import { WorkExperienceModel } from '../models/WorkExperienceModel';
import { WorkExperience, IWorkExperienceRepository } from '../domain/WorkExperience';

export class WorkExperienceRepository implements IWorkExperienceRepository {
  public async findAll(): Promise<WorkExperience[]> {
    const data = await WorkExperienceModel.findAll();
    return data.map((d) => new WorkExperience(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<WorkExperience | null> {
    const data = await WorkExperienceModel.findByPk(id);
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
}
