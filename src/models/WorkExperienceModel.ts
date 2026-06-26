import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WorkExperienceAttributes {
  id: number;
  company: string;
  position: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  column_order?: number;
  achievements?: any;
  created_at?: Date;
  updated_at?: Date;
}

interface WorkExperienceCreationAttributes extends Optional<WorkExperienceAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class WorkExperienceModel extends Model<WorkExperienceAttributes, WorkExperienceCreationAttributes> implements WorkExperienceAttributes {
  public id!: number;
  public company!: string;
  public position!: string;
  public location?: string;
  public start_date?: string;
  public end_date?: string;
  public is_current?: boolean;
  public description?: string;
  public column_order?: number;
  public achievements?: any;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

WorkExperienceModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    column_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    achievements: {
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
    tableName: 'work_experiences',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
