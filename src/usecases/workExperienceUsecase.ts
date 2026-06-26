import { IWorkExperienceRepository, WorkExperience } from '../domain/WorkExperience';

export interface IWorkExperienceUsecase {
  getAll(): Promise<WorkExperience[]>;
  create(data: any): Promise<WorkExperience>;
}

export class WorkExperienceUsecase implements IWorkExperienceUsecase {
  private repo: IWorkExperienceRepository;

  constructor(repo: IWorkExperienceRepository) {
    this.repo = repo;
  }

  public async getAll(): Promise<WorkExperience[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<WorkExperience> {
    const newEntity = new WorkExperience({
      company: data.company,
      position: data.position,
      location: data.location,
      start_date: data.start_date,
      end_date: data.end_date,
      is_current: data.is_current,
      description: data.description,
      column_order: data.column_order,
      achievements: data.achievements,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }
}
