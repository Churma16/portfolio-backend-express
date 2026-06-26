import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProfileAttributes {
  id: number;
  user_id: number;
  name: string;
  headline?: string;
  role?: string;
  bio_short?: string;
  bio_long?: string;
  location?: string;
  is_hireable?: boolean;
  avatar?: string;
  cv_files?: string;
  hero_image_codes?: string;
  socials?: any;
  created_at?: Date;
  updated_at?: Date;
}

interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class ProfileModel extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: number;
  public user_id!: number;
  public name!: string;
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
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ProfileModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    headline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio_short: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio_long: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_hireable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cv_files: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hero_image_codes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    socials: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
