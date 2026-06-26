const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const entities = [
  {
    name: 'User',
    tableName: 'users',
    fields: [
      { name: 'id', tsType: 'number', dbType: 'BIGINT', autoInc: true, pk: true },
      { name: 'email', tsType: 'string', dbType: 'STRING', required: true, unique: true },
      { name: 'password', tsType: 'string', dbType: 'STRING', required: true }
    ]
  },
  {
    name: 'Category',
    tableName: 'categories',
    fields: [
      { name: 'id', tsType: 'number', dbType: 'BIGINT', autoInc: true, pk: true },
      { name: 'name', tsType: 'string', dbType: 'STRING', required: true },
      { name: 'slug', tsType: 'string', dbType: 'STRING', required: true, unique: true },
      { name: 'color', tsType: 'string', dbType: 'STRING' }
    ]
  },
  {
    name: 'Message',
    tableName: 'messages',
    fields: [
      { name: 'id', tsType: 'number', dbType: 'BIGINT', autoInc: true, pk: true },
      { name: 'name', tsType: 'string', dbType: 'STRING', required: true },
      { name: 'email', tsType: 'string', dbType: 'STRING', required: true },
      { name: 'content', tsType: 'string', dbType: 'TEXT', required: true },
      { name: 'is_read', tsType: 'boolean', dbType: 'BOOLEAN', default: false }
    ]
  },
  {
    name: 'TechStack',
    tableName: 'tech_stacks',
    fields: [
      { name: 'id', tsType: 'number', dbType: 'BIGINT', autoInc: true, pk: true },
      { name: 'name', tsType: 'string', dbType: 'STRING', required: true },
      { name: 'slug', tsType: 'string', dbType: 'STRING', required: true, unique: true },
      { name: 'icon', tsType: 'string', dbType: 'STRING' },
      { name: 'column_order', tsType: 'number', dbType: 'INTEGER' }
    ]
  },
  {
    name: 'Tag',
    tableName: 'tags',
    fields: [
      { name: 'id', tsType: 'number', dbType: 'BIGINT', autoInc: true, pk: true },
      { name: 'name', tsType: 'string', dbType: 'STRING', required: true },
      { name: 'slug', tsType: 'string', dbType: 'STRING', required: true, unique: true },
      { name: 'color', tsType: 'string', dbType: 'STRING' },
      { name: 'category_id', tsType: 'number', dbType: 'BIGINT' }
    ]
  },
  {
    name: 'Profile',
    tableName: 'profiles',
    fields: [
      { name: 'id', tsType: 'number', dbType: 'BIGINT', autoInc: true, pk: true },
      { name: 'user_id', tsType: 'number', dbType: 'BIGINT', required: true },
      { name: 'name', tsType: 'string', dbType: 'STRING', required: true },
      { name: 'headline', tsType: 'string', dbType: 'STRING' },
      { name: 'role', tsType: 'string', dbType: 'STRING' },
      { name: 'bio_short', tsType: 'string', dbType: 'TEXT' },
      { name: 'bio_long', tsType: 'string', dbType: 'TEXT' },
      { name: 'location', tsType: 'string', dbType: 'STRING' },
      { name: 'is_hireable', tsType: 'boolean', dbType: 'BOOLEAN', default: false },
      { name: 'avatar', tsType: 'string', dbType: 'STRING' },
      { name: 'cv_files', tsType: 'string', dbType: 'STRING' },
      { name: 'hero_image_codes', tsType: 'string', dbType: 'STRING' },
      { name: 'socials', tsType: 'any', dbType: 'JSONB' }
    ]
  },
  {
    name: 'WorkExperience',
    tableName: 'work_experiences',
    fields: [
      { name: 'id', tsType: 'number', dbType: 'BIGINT', autoInc: true, pk: true },
      { name: 'company', tsType: 'string', dbType: 'STRING', required: true },
      { name: 'position', tsType: 'string', dbType: 'STRING', required: true },
      { name: 'location', tsType: 'string', dbType: 'STRING' },
      { name: 'start_date', tsType: 'string', dbType: 'STRING' },
      { name: 'end_date', tsType: 'string', dbType: 'STRING' },
      { name: 'is_current', tsType: 'boolean', dbType: 'BOOLEAN', default: false },
      { name: 'description', tsType: 'string', dbType: 'TEXT' },
      { name: 'column_order', tsType: 'number', dbType: 'INTEGER' },
      { name: 'achievements', tsType: 'any', dbType: 'JSONB' }
    ]
  }
];

function generateModel(entity) {
  let attributes = '';
  let initConfig = '';
  
  entity.fields.forEach(f => {
    attributes += `  public ${f.name}${f.required || f.pk ? '!' : '?'}: ${f.tsType};\n`;
    
    let config = `    ${f.name}: {\n      type: DataTypes.${f.dbType},\n`;
    if (f.pk) config += `      primaryKey: true,\n      autoIncrement: true,\n`;
    if (f.required && !f.pk) config += `      allowNull: false,\n`;
    else if (!f.pk) config += `      allowNull: true,\n`;
    if (f.unique) config += `      unique: true,\n`;
    if (f.default !== undefined) config += `      defaultValue: ${f.default},\n`;
    config += `    },\n`;
    initConfig += config;
  });

  const content = `import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ${entity.name}Attributes {
${entity.fields.map(f => `  ${f.name}${f.required || f.pk ? '' : '?'}: ${f.tsType};`).join('\n')}
  created_at?: Date;
  updated_at?: Date;
}

interface ${entity.name}CreationAttributes extends Optional<${entity.name}Attributes, 'id' | 'created_at' | 'updated_at'> {}

export class ${entity.name}Model extends Model<${entity.name}Attributes, ${entity.name}CreationAttributes> implements ${entity.name}Attributes {
${attributes}  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

${entity.name}Model.init(
  {
${initConfig}    created_at: {
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
    tableName: '${entity.tableName}',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
`;
  fs.writeFileSync(path.join(srcDir, 'models', `${entity.name}Model.ts`), content);
}

function generateDomain(entity) {
  const content = `export class ${entity.name} {
${entity.fields.map(f => `  public ${f.name}${f.required || f.pk ? '' : '?'}: ${f.tsType};`).join('\n')}
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: any) {
${entity.fields.map(f => `    this.${f.name} = data.${f.name};`).join('\n')}
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public validate(): void {
    // Add domain validation logic here
  }
}

export interface I${entity.name}Repository {
  findAll(): Promise<${entity.name}[]>;
  findById(id: number): Promise<${entity.name} | null>;
  create(data: ${entity.name}): Promise<${entity.name}>;
}
`;
  fs.writeFileSync(path.join(srcDir, 'domain', `${entity.name}.ts`), content);
}

function generateRepo(entity) {
  const lcName = entity.name.charAt(0).toLowerCase() + entity.name.slice(1);
  const content = `import { ${entity.name}Model } from '../models/${entity.name}Model';
import { ${entity.name}, I${entity.name}Repository } from '../domain/${entity.name}';

export class ${entity.name}Repository implements I${entity.name}Repository {
  public async findAll(): Promise<${entity.name}[]> {
    const data = await ${entity.name}Model.findAll();
    return data.map((d) => new ${entity.name}(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<${entity.name} | null> {
    const data = await ${entity.name}Model.findByPk(id);
    if (!data) return null;
    return new ${entity.name}(data.get({ plain: true }));
  }

  public async create(entity: ${entity.name}): Promise<${entity.name}> {
    const data = await ${entity.name}Model.create({
${entity.fields.filter(f => !f.pk).map(f => `      ${f.name}: entity.${f.name},`).join('\n')}
    });
    return new ${entity.name}(data.get({ plain: true }));
  }
}
`;
  fs.writeFileSync(path.join(srcDir, 'repositories', `${lcName}Repository.ts`), content);
}

function generateUsecase(entity) {
  const lcName = entity.name.charAt(0).toLowerCase() + entity.name.slice(1);
  const content = `import { I${entity.name}Repository, ${entity.name} } from '../domain/${entity.name}';

export interface I${entity.name}Usecase {
  getAll(): Promise<${entity.name}[]>;
  create(data: any): Promise<${entity.name}>;
}

export class ${entity.name}Usecase implements I${entity.name}Usecase {
  private repo: I${entity.name}Repository;

  constructor(repo: I${entity.name}Repository) {
    this.repo = repo;
  }

  public async getAll(): Promise<${entity.name}[]> {
    return this.repo.findAll();
  }

  public async create(data: any): Promise<${entity.name}> {
    const newEntity = new ${entity.name}({
${entity.fields.filter(f => !f.pk).map(f => `      ${f.name}: data.${f.name},`).join('\n')}
    });
    
    newEntity.validate();
    return this.repo.create(newEntity);
  }
}
`;
  fs.writeFileSync(path.join(srcDir, 'usecases', `${lcName}Usecase.ts`), content);
}

function generateController(entity) {
  const lcName = entity.name.charAt(0).toLowerCase() + entity.name.slice(1);
  const content = `import { Request, Response } from 'express';
import { I${entity.name}Usecase } from '../usecases/${lcName}Usecase';
import { newMeta, newMultipleDataResponse, newSingleDataResponse, errorResponse } from '../shared/utils/response';

export class ${entity.name}Controller {
  private usecase: I${entity.name}Usecase;

  constructor(usecase: I${entity.name}Usecase) {
    this.usecase = usecase;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.getAll();
      const meta = newMeta(200, 'success', '${entity.name} retrieved successfully');
      res.status(200).json(newMultipleDataResponse(meta, data));
    } catch (error: any) {
      res.status(500).json(errorResponse(500, 'error', error.message));
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.usecase.create(req.body);
      const meta = newMeta(201, 'success', '${entity.name} created successfully');
      res.status(201).json(newSingleDataResponse(meta, data));
    } catch (error: any) {
      res.status(400).json(errorResponse(400, 'error', error.message));
    }
  }
}
`;
  fs.writeFileSync(path.join(srcDir, 'controllers', `${lcName}Controller.ts`), content);
}

entities.forEach(entity => {
  generateModel(entity);
  generateDomain(entity);
  generateRepo(entity);
  generateUsecase(entity);
  generateController(entity);
  console.log(`Generated ${entity.name}`);
});
