import { PrismaService } from '../prisma/prisma.service';

export type CustomerSaleTotals = {
  saleCount: number;
  totalSpent: number;
};

export async function saleTotalsForCustomer(
  prisma: PrismaService,
  customerId: string,
): Promise<CustomerSaleTotals> {
  const result = await prisma.sale.aggregate({
    where: {
      customerId,
      status: 'completed',
    },
    _count: { id: true },
    _sum: { totalAmount: true },
  });
  return {
    saleCount: result._count.id,
    totalSpent: Number(result._sum.totalAmount ?? 0),
  };
}
