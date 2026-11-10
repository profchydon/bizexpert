import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { Prisma } from '@prisma/client';

import { getCashflowAnalytics } from './analytics-cashflow';
import { getCustomerAnalytics } from './analytics-customers';
import { resolveDateRange, type AnalyticsQuery } from './analytics-range';
import { PrismaService } from '../prisma/prisma.service';

export type { AnalyticsQuery } from './analytics-range';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCashflow(businessId: string, query: AnalyticsQuery) {
    return getCashflowAnalytics(this.prisma, businessId, query);
  }

  async getCustomerAnalytics(businessId: string, query: AnalyticsQuery) {
    return getCustomerAnalytics(this.prisma, businessId, query);
  }

  async getCollectionSummary(businessId: string, query: AnalyticsQuery) {
    const { start, end } = resolveDateRange(query);

    const cashRows = await this.prisma.$queryRaw<{ cashCollected: string }[]>`
      SELECT COALESCE(SUM(p.amount), 0) AS "cashCollected"
      FROM payments p
      INNER JOIN sales s ON s.id = p."saleId"
      WHERE s."businessId" = ${businessId}::uuid
        AND s.status = 'completed'
        AND p."paidAt" >= ${start}
        AND p."paidAt" <= ${end}
        ${query.locationId ? Prisma.sql`AND s."locationId" = ${query.locationId}::uuid` : Prisma.empty}
    `;

    const creditRows = await this.prisma.$queryRaw<
      { saleId: string; totalAmount: string; paid: string }[]
    >`
      SELECT s.id AS "saleId", s."totalAmount" AS "totalAmount", COALESCE(SUM(pay.amount), 0) AS paid
      FROM sales s
      LEFT JOIN payments pay ON pay."saleId" = s.id
      WHERE s."businessId" = ${businessId}::uuid
        AND s.status = 'completed'
        AND s."createdAt" >= ${start}
        AND s."createdAt" <= ${end}
        AND s."paymentStatus" IN ('credit', 'partial')
        ${query.locationId ? Prisma.sql`AND s."locationId" = ${query.locationId}::uuid` : Prisma.empty}
      GROUP BY s.id
    `;

    let outstandingCredit = 0;
    for (const row of creditRows) {
      outstandingCredit += Math.max(
        0,
        parseFloat(row.totalAmount) - parseFloat(row.paid),
      );
    }

    const revenueSummary = await this.getSalesSummary(businessId, query);

    return {
      totalRevenue: revenueSummary.totalRevenue,
      cashCollected: parseFloat(cashRows[0]?.cashCollected ?? '0'),
      outstandingCredit: parseFloat(outstandingCredit.toFixed(2)),
      period: { start: start.toISOString(), end: end.toISOString() },
    };
  }

  async getSalesSummary(businessId: string, query: AnalyticsQuery) {
    const { start, end } = resolveDateRange(query);

    const rows = await this.prisma.$queryRaw<
      {
        totalRevenue: string;
        totalCost: string;
        grossProfit: string;
        completedSalesCount: string;
        averageOrderValue: string;
      }[]
    >`
      SELECT
        COALESCE(SUM(s."totalAmount"), 0) AS "totalRevenue",
        COALESCE(SUM(s."totalCost"), 0) AS "totalCost",
        COALESCE(SUM(s."grossProfit"), 0) AS "grossProfit",
        COUNT(*)::text AS "completedSalesCount",
        COALESCE(AVG(s."totalAmount"), 0)::text AS "averageOrderValue"
      FROM sales s
      WHERE s."businessId" = ${businessId}::uuid
        AND s.status = 'completed'
        AND s."createdAt" >= ${start}
        AND s."createdAt" <= ${end}
        ${query.locationId ? Prisma.sql`AND s."locationId" = ${query.locationId}::uuid` : Prisma.empty}
    `;

    const raw = rows[0];
    const totalRevenue = parseFloat(raw.totalRevenue);
    const totalCost = parseFloat(raw.totalCost);
    const grossProfit = parseFloat(raw.grossProfit);

    return {
      totalRevenue,
      totalCost,
      grossProfit,
      grossMarginPct:
        totalRevenue > 0
          ? parseFloat(((grossProfit / totalRevenue) * 100).toFixed(2))
          : 0,
      completedSalesCount: parseInt(raw.completedSalesCount, 10),
      averageOrderValue: parseFloat(
        parseFloat(raw.averageOrderValue).toFixed(2),
      ),
      period: { start: start.toISOString(), end: end.toISOString() },
    };
  }

  async getSalesByPeriod(
    businessId: string,
    query: AnalyticsQuery,
    groupBy: 'day' | 'week' | 'month' = 'day',
  ) {
    const { start, end } = resolveDateRange(query);
    const dateTrunc =
      groupBy === 'month' ? 'month' : groupBy === 'week' ? 'week' : 'day';

    const rows = await this.prisma.$queryRaw<
      { period: Date; revenue: string; profit: string; salesCount: string }[]
    >`
      SELECT
        DATE_TRUNC(${dateTrunc}, s."createdAt") AS period,
        COALESCE(SUM(s."totalAmount"), 0) AS revenue,
        COALESCE(SUM(s."grossProfit"), 0) AS profit,
        COUNT(*)::text AS "salesCount"
      FROM sales s
      WHERE s."businessId" = ${businessId}::uuid
        AND s.status = 'completed'
        AND s."createdAt" >= ${start}
        AND s."createdAt" <= ${end}
        ${query.locationId ? Prisma.sql`AND s."locationId" = ${query.locationId}::uuid` : Prisma.empty}
      GROUP BY period
      ORDER BY period ASC
    `;

    return rows.map((r) => ({
      period: r.period,
      revenue: parseFloat(r.revenue),
      profit: parseFloat(r.profit),
      salesCount: parseInt(r.salesCount, 10),
    }));
  }

  async getTopProducts(businessId: string, query: AnalyticsQuery) {
    const { start, end } = resolveDateRange(query);
    const limit = query.limit ?? 10;

    const rows = await this.prisma.$queryRaw<
      {
        productId: string;
        productName: string;
        totalRevenue: string;
        totalProfit: string;
        totalQuantity: string;
      }[]
    >`
      SELECT
        si."productId" AS "productId",
        si."productName" AS "productName",
        COALESCE(SUM(si."lineTotal"), 0) AS "totalRevenue",
        COALESCE(SUM(si."lineProfit"), 0) AS "totalProfit",
        COALESCE(SUM(si.quantity), 0) AS "totalQuantity"
      FROM sale_items si
      INNER JOIN sales s ON s.id = si."saleId"
      WHERE s."businessId" = ${businessId}::uuid
        AND s.status = 'completed'
        AND s."createdAt" >= ${start}
        AND s."createdAt" <= ${end}
        ${query.locationId ? Prisma.sql`AND s."locationId" = ${query.locationId}::uuid` : Prisma.empty}
      GROUP BY si."productId", si."productName"
      ORDER BY "totalRevenue" DESC
      LIMIT ${limit}
    `;

    return rows.map((r) => ({
      productId: r.productId,
      productName: r.productName,
      totalRevenue: parseFloat(r.totalRevenue),
      totalProfit: parseFloat(r.totalProfit),
      totalQuantity: parseFloat(r.totalQuantity),
    }));
  }

  async getSlowMovingProducts(
    businessId: string,
    query: AnalyticsQuery,
    daysThreshold = 30,
  ) {
    const since = subDays(new Date(), daysThreshold);

    const sold = await this.prisma.saleItem.findMany({
      where: {
        sale: {
          businessId,
          status: 'completed',
          createdAt: { gte: since },
        },
      },
      select: { productId: true },
      distinct: ['productId'],
    });
    const excludeIds = sold.map((r) => r.productId);

    return this.prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
        ...(excludeIds.length ? { id: { notIn: excludeIds } } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async getInventoryValuation(businessId: string, locationId?: string) {
    const rows = await this.prisma.$queryRaw<
      {
        productId: string;
        productName: string;
        category: string | null;
        baseUnit: string;
        locationId: string;
        locationName: string;
        quantity: string;
        averageCost: string;
        totalValue: string;
      }[]
    >`
      SELECT
        p.id AS "productId",
        p.name AS "productName",
        p.category,
        p."baseUnit" AS "baseUnit",
        l.id AS "locationId",
        l.name AS "locationName",
        ib.quantity,
        ib."averageCost" AS "averageCost",
        ib."totalValue" AS "totalValue"
      FROM inventory_balances ib
      INNER JOIN products p ON p.id = ib."productId"
      INNER JOIN locations l ON l.id = ib."locationId"
      WHERE l."businessId" = ${businessId}::uuid
        AND p."isActive" = true
        ${locationId ? Prisma.sql`AND ib."locationId" = ${locationId}::uuid` : Prisma.empty}
    `;

    const totalValue = rows.reduce(
      (sum, r) => sum + parseFloat(r.totalValue ?? '0'),
      0,
    );

    return {
      items: rows.map((r) => ({
        productId: r.productId,
        productName: r.productName,
        category: r.category,
        baseUnit: r.baseUnit,
        locationId: r.locationId,
        locationName: r.locationName,
        quantity: parseFloat(r.quantity),
        averageCost: parseFloat(r.averageCost),
        totalValue: parseFloat(r.totalValue),
      })),
      totalValue: parseFloat(totalValue.toFixed(2)),
    };
  }

  async getLowStockAlerts(businessId: string, locationId?: string) {
    const rows = await this.prisma.$queryRaw<Record<string, string>[]>`
      SELECT
        p.id AS "productId",
        p.name AS "productName",
        p.category,
        l.id AS "locationId",
        l.name AS "locationName",
        ib.quantity::text AS "currentStock",
        COALESCE(ib."lowStockThreshold", p."lowStockThreshold")::text AS threshold
      FROM inventory_balances ib
      INNER JOIN products p ON p.id = ib."productId"
      INNER JOIN locations l ON l.id = ib."locationId"
      WHERE l."businessId" = ${businessId}::uuid
        AND p."isActive" = true
        AND ib.quantity <= COALESCE(ib."lowStockThreshold", p."lowStockThreshold")
        ${locationId ? Prisma.sql`AND ib."locationId" = ${locationId}::uuid` : Prisma.empty}
      ORDER BY ib.quantity ASC
    `;

    return rows;
  }

  async getLocationComparison(businessId: string, query: AnalyticsQuery) {
    const { start, end } = resolveDateRange(query);

    const rows = await this.prisma.$queryRaw<
      {
        locationId: string;
        locationName: string;
        totalRevenue: string;
        totalProfit: string;
        totalCost: string;
        salesCount: string;
      }[]
    >`
      SELECT
        s."locationId" AS "locationId",
        l.name AS "locationName",
        COALESCE(SUM(s."totalAmount"), 0) AS "totalRevenue",
        COALESCE(SUM(s."grossProfit"), 0) AS "totalProfit",
        COALESCE(SUM(s."totalCost"), 0) AS "totalCost",
        COUNT(*)::text AS "salesCount"
      FROM sales s
      INNER JOIN locations l ON l.id = s."locationId"
      WHERE s."businessId" = ${businessId}::uuid
        AND s.status = 'completed'
        AND s."createdAt" >= ${start}
        AND s."createdAt" <= ${end}
      GROUP BY s."locationId", l.name
      ORDER BY "totalRevenue" DESC
    `;

    return rows.map((r) => ({
      locationId: r.locationId,
      locationName: r.locationName,
      totalRevenue: parseFloat(r.totalRevenue),
      totalProfit: parseFloat(r.totalProfit),
      totalCost: parseFloat(r.totalCost),
      salesCount: parseInt(r.salesCount, 10),
    }));
  }
}
