export class Profile {
  public id: number;
  public user_id: number;
  public name: string;
  public headline?: string;
  public role?: string;
  public bio_short?: string;
  public bio_long?: string;
  public location?: string;
  public is_hireable?: boolean;
  public avatar?: string;
  public cv_files?: string;
  public hero_image_codes?: string;
  public socials?: any;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.name = data.name;
    this.headline = data.headline;
    this.role = data.role;
    this.bio_short = data.bio_short;
    this.bio_long = data.bio_long;
    this.location = data.location;
    this.is_hireable = data.is_hireable;
    this.avatar = data.avatar;
    this.cv_files = data.cv_files;
    this.hero_image_codes = data.hero_image_codes;
    this.socials = data.socials;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public validate(): void {
    // Add domain validation logic here
  }
}

export interface IProfileRepository {
  findAll(): Promise<Profile[]>;
  findById(id: number): Promise<Profile | null>;
  create(data: Profile): Promise<Profile>;
}
