import { ProfileModel } from '../models/ProfileModel';
import { Profile, IProfileRepository } from '../domain/Profile';

export class ProfileRepository implements IProfileRepository {
  public async findAll(): Promise<Profile[]> {
    const data = await ProfileModel.findAll();
    return data.map((d) => new Profile(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<Profile | null> {
    const data = await ProfileModel.findByPk(id);
    if (!data) return null;
    return new Profile(data.get({ plain: true }));
  }

  public async create(entity: Profile): Promise<Profile> {
    const data = await ProfileModel.create({
      user_id: entity.user_id,
      name: entity.name,
      headline: entity.headline,
      role: entity.role,
      bio_short: entity.bio_short,
      bio_long: entity.bio_long,
      location: entity.location,
      is_hireable: entity.is_hireable,
      avatar: entity.avatar,
      cv_files: entity.cv_files,
      hero_image_codes: entity.hero_image_codes,
      socials: entity.socials,
    });
    return new Profile(data.get({ plain: true }));
  }


  public async update(id: number, data: Partial<Profile>): Promise<Profile | null> {
    await ProfileModel.update(data, { where: { id } as any });
    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await ProfileModel.destroy({ where: { id } as any });
    return deleted > 0;
  }

}
