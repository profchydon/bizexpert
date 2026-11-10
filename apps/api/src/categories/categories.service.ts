import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  canDeleteCategory,
  namesMatch,
  normalizeCategoryName,
} from './category-name.util';
import {
  assertValidParent,
  findScopedNameConflict,
} from './category-hierarchy.util';
import {
  enrichCategoryRecord,
  listCategoryRecords,
  type CategoryRecord,
} from './category-list.util';
import { renameCategoryProducts } from './category-rename.util';
import { syncCategoriesFromProducts, withProductCount } from './category-sync';

export type { CategoryRecord };

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertBusinessAccess(userId: string, businessId: string) {
    const membership = await this.prisma.businessMembership.findFirst({
      where: { userId, businessId, isActive: true },
    });
    if (!membership) throw new ForbiddenException('No access to this business');
    return membership;
  }

  private parseName(raw: string): string {
    const name = normalizeCategoryName(raw);
    if (!name) throw new BadRequestException('Category name is required');
    if (name.length > 100) {
      throw new BadRequestException(
        'Category name must be 100 characters or fewer',
      );
    }
    return name;
  }

  private async requireCategory(id: string, businessId: string) {
    const row = await this.prisma.category.findFirst({
      where: { id, businessId },
    });
    if (!row) throw new NotFoundException('Category not found');
    return row;
  }

  async findAll(businessId: string, userId: string): Promise<CategoryRecord[]> {
    await this.assertBusinessAccess(userId, businessId);
    await syncCategoriesFromProducts(this.prisma, businessId);
    return listCategoryRecords(this.prisma, businessId);
  }

  async findOne(
    id: string,
    businessId: string,
    userId: string,
  ): Promise<CategoryRecord> {
    await this.assertBusinessAccess(userId, businessId);
    return enrichCategoryRecord(
      this.prisma,
      await this.requireCategory(id, businessId),
    );
  }

  async create(
    businessId: string,
    userId: string,
    dto: { name: string; parentId?: string | null },
  ): Promise<CategoryRecord> {
    await this.assertBusinessAccess(userId, businessId);
    const name = this.parseName(dto.name);
    const parentId = dto.parentId?.trim() ? dto.parentId : null;
    const existing = await this.prisma.category.findMany({
      where: { businessId },
      select: { id: true, name: true, parentId: true, businessId: true },
    });
    if (parentId) {
      const parent = existing.find((row) => row.id === parentId) ?? null;
      assertValidParent(parent, businessId);
    }
    if (findScopedNameConflict(existing, name, parentId)) {
      throw new ConflictException('A category with this name already exists');
    }
    const row = await this.prisma.category.create({
      data: { businessId, name, parentId },
    });
    return enrichCategoryRecord(this.prisma, row);
  }

  async update(
    id: string,
    businessId: string,
    userId: string,
    dto: { name: string },
  ): Promise<CategoryRecord> {
    await this.assertBusinessAccess(userId, businessId);
    const current = await this.requireCategory(id, businessId);
    const name = this.parseName(dto.name);
    if (namesMatch(current.name, name) && current.name === name) {
      return enrichCategoryRecord(this.prisma, current);
    }
    const existing = await this.prisma.category.findMany({
      where: { businessId },
      select: { id: true, name: true, parentId: true, businessId: true },
    });
    if (findScopedNameConflict(existing, name, current.parentId, id)) {
      throw new ConflictException('A category with this name already exists');
    }
    const parent = current.parentId
      ? existing.find((row) => row.id === current.parentId)
      : null;
    const row = await this.prisma.$transaction(async (tx) => {
      await renameCategoryProducts(tx, {
        businessId,
        currentName: current.name,
        nextName: name,
        parentName: parent?.name ?? null,
        isSub: Boolean(current.parentId),
      });
      return tx.category.update({ where: { id }, data: { name } });
    });
    return enrichCategoryRecord(this.prisma, row);
  }

  async remove(id: string, businessId: string, userId: string): Promise<void> {
    await this.assertBusinessAccess(userId, businessId);
    const current = await this.requireCategory(id, businessId);
    const childCount = await this.prisma.category.count({
      where: { businessId, parentId: id },
    });
    if (childCount > 0) {
      throw new ConflictException(
        'Cannot delete a category that still has sub-categories',
      );
    }
    const parent = current.parentId
      ? await this.requireCategory(current.parentId, businessId)
      : null;
    const counted = await withProductCount(
      this.prisma,
      current,
      parent?.name ?? null,
    );
    if (!canDeleteCategory(counted.productCount)) {
      throw new ConflictException(
        'Cannot delete a category that still has products',
      );
    }
    await this.prisma.category.delete({ where: { id } });
  }
}
