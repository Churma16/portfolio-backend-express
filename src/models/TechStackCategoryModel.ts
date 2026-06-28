import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TechStackCategoryAttributes {
  id: number;
  name: string;
  slug: string;
  color?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface TechStackCategoryCreationAttributes extends Optional<TechStackCategoryAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class TechStackCategoryModel extends Model<TechStackCategoryAttributes, TechStackCategoryCreationAttributes> implements TechStackCategoryAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public color?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TechStackCategoryModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING,
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
    tableName: 'tech_stack_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
