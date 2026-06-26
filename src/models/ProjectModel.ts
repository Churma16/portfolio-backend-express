import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProjectAttributes {
  id: number;
  title: string;
  slug: string;
  thumbnail?: string;
  content?: string;
  demo_url?: string;
  repo_url?: string;
  is_featured?: boolean;
  published_at?: Date;
  column_order?: number;
  category_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'created_at' | 'updated_at' | 'column_order' | 'is_featured'> {}

export class ProjectModel extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public title!: string;
  public slug!: string;
  public thumbnail?: string;
  public content?: string;
  public demo_url?: string;
  public repo_url?: string;
  public is_featured?: boolean;
  public published_at?: Date;
  public column_order?: number;
  public category_id?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ProjectModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    demo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    repo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    column_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.BIGINT,
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
    tableName: 'projects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
