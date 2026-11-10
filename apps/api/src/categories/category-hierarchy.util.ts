import { BadRequestException } from '@nestjs/common';

import { findNameConflict, namesMatch } from './category-name.util';

type CategoryRef = {
  id: string;
  name: string;
  parentId: string | null;
  businessId: string;
};

export function findScopedNameConflict(
  existing: CategoryRef[],
  name: string,
  parentId: string | null | undefined,
  excludeId?: string,
): CategoryRef | undefined {
  const scoped = existing.filter((row) =>
    parentId ? row.parentId === parentId : row.parentId === null,
  );
  return findNameConflict(scoped, name, excludeId);
}

export function assertValidParent(
  parent: CategoryRef | null,
  businessId: string,
): void {
  if (!parent) {
    throw new BadRequestException('Parent category not found');
  }
  if (parent.businessId !== businessId) {
    throw new BadRequestException('Parent category not found');
  }
  if (parent.parentId) {
    throw new BadRequestException('Sub-categories cannot have children');
  }
}

export function parentNameForRow(
  row: CategoryRef,
  byId: Map<string, CategoryRef>,
): string | null {
  if (!row.parentId) return null;
  return byId.get(row.parentId)?.name ?? null;
}

export function namesMatchOptional(
  left?: string | null,
  right?: string | null,
): boolean {
  if (!left?.trim() && !right?.trim()) return true;
  if (!left || !right) return false;
  return namesMatch(left, right);
}
