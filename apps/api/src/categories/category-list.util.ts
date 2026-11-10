import { PrismaService } from '../prisma/prisma.service';
import { parentNameForRow } from './category-hierarchy.util';
import { withProductCount } from './category-sync';

export type CategoryRecord = {
  id: string;
  businessId: string;
  parentId: string | null;
  parentName: string | null;
  name: string;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type CategoryRow = {
  id: string;
  businessId: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function enrichCategoryRecord(
  prisma: PrismaService,
  row: CategoryRow,
  parentName?: string | null,
): Promise<CategoryRecord> {
  const resolvedParent =
    parentName !== undefined
      ? parentName
      : row.parentId
        ? (
            await prisma.category.findFirst({
              where: { id: row.parentId, businessId: row.businessId },
              select: { name: true },
            })
          )?.name ?? null
        : null;
  const counted = await withProductCount(
    prisma,
    row,
    resolvedParent,
  );
  return { ...counted, parentName: resolvedParent };
}

export async function listCategoryRecords(
  prisma: PrismaService,
  businessId: string,
): Promise<CategoryRecord[]> {
  const rows = await prisma.category.findMany({
    where: { businessId },
    orderBy: [{ parentId: 'asc' }, { name: 'asc' }],
  });
  const byId = new Map(rows.map((row) => [row.id, row]));
  return Promise.all(
    rows.map((row) =>
      enrichCategoryRecord(
        prisma,
        row,
        parentNameForRow(row, byId),
      ),
    ),
  );
}
