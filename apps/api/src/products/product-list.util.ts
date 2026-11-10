import type { Product } from '@prisma/client';

import type { PrismaService } from '../prisma/prisma.service';

export type ProductListRow = Product & {
  variantCount: number;
  totalStock: number;
};

export async function attachProductListMeta(
  prisma: PrismaService,
  rows: Product[],
): Promise<ProductListRow[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const children = await prisma.product.findMany({
    where: { parentProductId: { in: ids }, isActive: true },
    select: { id: true, parentProductId: true },
  });
  const childByParent = new Map<string, string[]>();
  for (const child of children) {
    if (!child.parentProductId) continue;
    const list = childByParent.get(child.parentProductId) ?? [];
    list.push(child.id);
    childByParent.set(child.parentProductId, list);
  }
  const stockIds = [...ids, ...children.map((row) => row.id)];
  const grouped = await prisma.inventoryBalance.groupBy({
    by: ['productId'],
    where: { productId: { in: stockIds } },
    _sum: { quantity: true },
  });
  const stockByProduct = new Map(
    grouped.map((row) => [row.productId, Number(row._sum.quantity ?? 0)]),
  );
  const variantCounts = await Promise.all(
    ids.map((id) =>
      prisma.product.count({ where: { parentProductId: id, isActive: true } }),
    ),
  );
  return rows.map((row, index) => {
    const childIds = childByParent.get(row.id) ?? [];
    const totalStock =
      (stockByProduct.get(row.id) ?? 0) +
      childIds.reduce((sum, id) => sum + (stockByProduct.get(id) ?? 0), 0);
    return { ...row, variantCount: variantCounts[index], totalStock };
  });
}
