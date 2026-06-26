import { IProfileRepository, Profile } from '../domain/Profile';

export interface IProfileUsecase {
  getAll(): Promise<Profile[]>;
  create(data: any): Promise<Profile>;
}

export class ProfileUsecase implements IProfileUsecase {
  private repo: IProfileRepository;

  constructor(repo: IProfileRepository) {
    this.repo = repo;
  }

  public async getAll(): Promise<Profile[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<Profile> {
    const newEntity = new Profile({
      user_id: data.user_id,
      name: data.name,
      headline: data.headline,
      role: data.role,
      bio_short: data.bio_short,
      bio_long: data.bio_long,
      location: data.location,
      is_hireable: data.is_hireable,
      avatar: data.avatar,
      cv_files: data.cv_files,
      hero_image_codes: data.hero_image_codes,
      socials: data.socials,
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }
}
