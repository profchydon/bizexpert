import { Prisma } from '@prisma/client';

type RenameArgs = {
  businessId: string;
  currentName: string;
  nextName: string;
  parentName?: string | null;
  isSub: boolean;
};

export async function renameCategoryProducts(
  tx: Prisma.TransactionClient,
  args: RenameArgs,
): Promise<void> {
  if (!args.isSub) {
    await tx.product.updateMany({
      where: {
        businessId: args.businessId,
        category: { equals: args.currentName, mode: 'insensitive' },
      },
      data: { category: args.nextName },
    });
    return;
  }
  if (!args.parentName) return;
  await tx.product.updateMany({
    where: {
      businessId: args.businessId,
      category: { equals: args.parentName, mode: 'insensitive' },
      subCategory: { equals: args.currentName, mode: 'insensitive' },
    },
    data: { subCategory: args.nextName },
  });
}
