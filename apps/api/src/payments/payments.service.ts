import { Injectable } from "@nestjs/common";
import { Payment } from "@prisma/client";
import { paymentListInclude, paymentListWhere } from "./payment-list.util";
import type { PaymentListQuery } from "./payment-list.util";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySale(saleId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { saleId },
      orderBy: { paidAt: "desc" },
    });
  }

  async findAll(
    businessId: string,
    query: PaymentListQuery & { page?: number; limit?: number },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = paymentListWhere(businessId, query);

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: paymentListInclude,
        orderBy: { paidAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, total };
  }
}
