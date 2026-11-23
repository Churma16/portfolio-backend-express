import { Op } from 'sequelize';
import sequelize from '../config/database';
import { TechStackModel } from '../models/TechStackModel';
import { TechStack, ITechStackRepository } from '../domain/TechStack';

export class TechStackRepository implements ITechStackRepository {
  public async findAll(): Promise<TechStack[]> {
    const data = await TechStackModel.findAll({
      order: [['column_order', 'ASC']]
    });
    return data.map((d) => new TechStack(d.get({ plain: true })));
  }

  public async findById(id: number): Promise<TechStack | null> {
    const data = await TechStackModel.findByPk(id);
    if (!data) return null;
    return new TechStack(data.get({ plain: true }));
  }

  public async create(entity: TechStack): Promise<TechStack> {
    const data = await TechStackModel.create({
      name: entity.name,
      slug: entity.slug,
      icon: entity.icon,
      column_order: entity.column_order,
      tech_stack_category_id: entity.tech_stack_category_id,
    });
    return new TechStack(data.get({ plain: true }));
  }


  public async update(id: number, data: Partial<TechStack>): Promise<TechStack | null> {
    await TechStackModel.update(data, { where: { id } as any });
    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deleted = await TechStackModel.destroy({ where: { id } as any });
    return deleted > 0;
  }

  public async reorder(id: number, direction: 'up' | 'down'): Promise<boolean> {
    const currentTechStack = await TechStackModel.findByPk(id);
    if (!currentTechStack) {
      return false;
    }

    const currentOrder = currentTechStack.column_order ?? 0;
    const operator = direction === 'up' ? Op.lt : Op.gt;
    const sortOrder: 'DESC' | 'ASC' = direction === 'up' ? 'DESC' : 'ASC';

    const adjacentTechStack = await TechStackModel.findOne({
      where: {
        column_order: {
          [operator]: currentOrder,
        },
      },
      order: [['column_order', sortOrder]],
    });

    if (!adjacentTechStack) {
      return true;
    }

    const transaction = await sequelize.transaction();
    try {
      const adjacentOrder = adjacentTechStack.column_order;
      await TechStackModel.update(
        { column_order: adjacentOrder },
        { where: { id: currentTechStack.id }, transaction }
      );
      await TechStackModel.update(
        { column_order: currentOrder },
        { where: { id: adjacentTechStack.id }, transaction }
      );
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
