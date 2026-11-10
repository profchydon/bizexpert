import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { categoryKey, namesToBackfill } from './category-name.util';
import { productCountForCategory } from './category-product-count';

type CategoryRow = {
  id: string;
  businessId: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function withProductCount(
  prisma: PrismaService,
  row: CategoryRow,
  parentName?: string | null,
) {
  return {
    ...row,
    productCount: await productCountForCategory(prisma, row, parentName),
  };
}

export async function syncCategoriesFromProducts(
  prisma: PrismaService,
  businessId: string,
): Promise<void> {
  const [rows, products] = await Promise.all([
    prisma.category.findMany({
      where: { businessId },
      select: { id: true, name: true, parentId: true },
    }),
    prisma.product.findMany({
      where: { businessId, NOT: { category: null } },
      select: { category: true, subCategory: true },
    }),
  ]);

  const mainByKey = new Map(
    rows
      .filter((row) => !row.parentId)
      .map((row) => [categoryKey(row.name), row.id]),
  );

  const mainMissing = namesToBackfill(
    rows.filter((row) => !row.parentId).map((row) => row.name),
    products.map((row) => row.category),
  );

  if (mainMissing.length > 0) {
    try {
      await prisma.category.createMany({
        data: mainMissing.map((name) => ({ businessId, name })),
        skipDuplicates: true,
      });
    } catch (error) {
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== 'P2002'
      ) {
        throw error;
      }
    }
    const refreshed = await prisma.category.findMany({
      where: { businessId, parentId: null },
      select: { id: true, name: true },
    });
    for (const row of refreshed) {
      mainByKey.set(categoryKey(row.name), row.id);
    }
  }

  const subKeys = new Set(
    rows
      .filter((row) => row.parentId)
      .map((row) => `${row.parentId}:${categoryKey(row.name)}`),
  );

  const subCreates: Array<{ businessId: string; parentId: string; name: string }> =
    [];

  for (const product of products) {
    const main = product.category?.trim();
    const sub = product.subCategory?.trim();
    if (!main || !sub) continue;
    const parentId = mainByKey.get(categoryKey(main));
    if (!parentId) continue;
    const key = `${parentId}:${categoryKey(sub)}`;
    if (subKeys.has(key)) continue;
    subKeys.add(key);
    subCreates.push({ businessId, parentId, name: sub });
  }

  if (subCreates.length === 0) return;

  try {
    await prisma.category.createMany({
      data: subCreates,
      skipDuplicates: true,
    });
  } catch (error) {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== 'P2002'
    ) {
      throw error;
    }
  }
}
