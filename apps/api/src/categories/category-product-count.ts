import { PrismaService } from '../prisma/prisma.service';

type CategoryRow = {
  id: string;
  businessId: string;
  name: string;
  parentId: string | null;
};

export async function productCountForCategory(
  prisma: PrismaService,
  row: CategoryRow,
  parentName?: string | null,
): Promise<number> {
  if (!row.parentId) {
    return prisma.product.count({
      where: {
        businessId: row.businessId,
        category: { equals: row.name, mode: 'insensitive' },
      },
    });
  }
  if (!parentName) return 0;
  return prisma.product.count({
    where: {
      businessId: row.businessId,
      category: { equals: parentName, mode: 'insensitive' },
      subCategory: { equals: row.name, mode: 'insensitive' },
    },
  });
}
