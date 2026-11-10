import { endOfDay } from "date-fns";
import { PaymentMethod, Prisma } from "@prisma/client";

export type PaymentListQuery = {
  locationId?: string;
  startDate?: string;
  endDate?: string;
  method?: string;
};

export const paymentListInclude = {
  sale: {
    select: {
      id: true,
      saleNumber: true,
      customerName: true,
      locationId: true,
      paymentStatus: true,
      totalAmount: true,
      status: true,
      location: { select: { id: true, name: true } },
    },
  },
} as const;

export function paymentListWhere(
  businessId: string,
  query: PaymentListQuery,
): Prisma.PaymentWhereInput {
  const sale: Prisma.SaleWhereInput = { businessId };
  if (query.locationId) sale.locationId = query.locationId;

  const where: Prisma.PaymentWhereInput = { sale };
  if (query.method) where.method = query.method as PaymentMethod;
  if (query.startDate || query.endDate) {
    const paidAt: Prisma.DateTimeFilter = {};
    if (query.startDate) paidAt.gte = new Date(query.startDate);
    if (query.endDate) paidAt.lte = endOfDay(new Date(query.endDate));
    where.paidAt = paidAt;
  }
  return where;
}
