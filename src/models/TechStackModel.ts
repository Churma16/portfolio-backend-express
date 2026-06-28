import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TechStackAttributes {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  column_order?: number;
  tech_stack_category_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface TechStackCreationAttributes extends Optional<TechStackAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class TechStackModel extends Model<TechStackAttributes, TechStackCreationAttributes> implements TechStackAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public icon?: string;
  public column_order?: number;
  public tech_stack_category_id?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TechStackModel.init(
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
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    column_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tech_stack_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'tech_stack_categories',
        key: 'id',
      },
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
    tableName: 'tech_stacks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
