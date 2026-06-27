import { ProjectModel } from './ProjectModel';
import { TechStackModel } from './TechStackModel';
import { TagModel } from './TagModel';
import { WorkExperienceModel } from './WorkExperienceModel';
import { CategoryModel } from './CategoryModel';

export const setupAssociations = () => {
  // Category Associations
  CategoryModel.hasMany(ProjectModel, { foreignKey: 'category_id', as: 'projects' });
  ProjectModel.belongsTo(CategoryModel, { foreignKey: 'category_id', as: 'category' });

  CategoryModel.hasMany(TagModel, { foreignKey: 'category_id', as: 'tags' });
  TagModel.belongsTo(CategoryModel, { foreignKey: 'category_id', as: 'category' });

  // Project <-> TechStack
  ProjectModel.belongsToMany(TechStackModel, {
    through: 'project_tech_stacks',
    foreignKey: 'project_id',
    otherKey: 'tech_stack_id',
    as: 'tech_stacks',
    timestamps: false,
  });
  TechStackModel.belongsToMany(ProjectModel, {
    through: 'project_tech_stacks',
    foreignKey: 'tech_stack_id',
    otherKey: 'project_id',
    as: 'projects',
    timestamps: false,
  });

  // Project <-> Tag
  ProjectModel.belongsToMany(TagModel, {
    through: 'project_tags',
    foreignKey: 'project_id',
    otherKey: 'tag_id',
    as: 'tags',
    timestamps: false,
  });
  TagModel.belongsToMany(ProjectModel, {
    through: 'project_tags',
    foreignKey: 'tag_id',
    otherKey: 'project_id',
    as: 'projects',
    timestamps: false,
  });

  // WorkExperience <-> TechStack
  WorkExperienceModel.belongsToMany(TechStackModel, {
    through: 'work_experience_tech_stacks',
    foreignKey: 'work_experience_id',
    otherKey: 'tech_stack_id',
    as: 'tech_stacks',
    timestamps: false,
  });
  TechStackModel.belongsToMany(WorkExperienceModel, {
    through: 'work_experience_tech_stacks',
    foreignKey: 'tech_stack_id',
    otherKey: 'work_experience_id',
    as: 'work_experiences',
    timestamps: false,
  });

  // WorkExperience <-> Tag
  WorkExperienceModel.belongsToMany(TagModel, {
    through: 'work_experience_tags',
    foreignKey: 'work_experience_id',
    otherKey: 'tag_id',
    as: 'tags',
    timestamps: false,
  });
  TagModel.belongsToMany(WorkExperienceModel, {
    through: 'work_experience_tags',
    foreignKey: 'tag_id',
    otherKey: 'work_experience_id',
    as: 'work_experiences',
    timestamps: false,
  });
};
