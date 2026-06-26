export class WorkExperience {
  public id: number;
  public company: string;
  public position: string;
  public location?: string;
  public start_date?: string;
  public end_date?: string;
  public is_current?: boolean;
  public description?: string;
  public column_order?: number;
  public achievements?: any;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.company = data.company;
    this.position = data.position;
    this.location = data.location;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.is_current = data.is_current;
    this.description = data.description;
    this.column_order = data.column_order;
    this.achievements = data.achievements;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public validate(): void {
    // Add domain validation logic here
  }
}

export interface IWorkExperienceRepository {
  findAll(): Promise<WorkExperience[]>;
  findById(id: number): Promise<WorkExperience | null>;
  create(data: WorkExperience): Promise<WorkExperience>;
}
