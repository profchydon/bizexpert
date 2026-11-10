import { Prisma } from '@prisma/client';
import { resolveDateRange, type AnalyticsQuery } from './analytics-range';
import type { PrismaService } from '../prisma/prisma.service';

export function averageSpend(totalSpent: number, buyers: number): number {
  if (buyers <= 0) return 0;
  return parseFloat((totalSpent / buyers).toFixed(2));
}

function saleLocationSql(locationId?: string) {
  return locationId
    ? Prisma.sql`AND s."locationId" = ${locationId}::uuid`
    : Prisma.empty;
}

export async function getCustomerAnalytics(
  prisma: PrismaService,
  businessId: string,
  query: AnalyticsQuery,
) {
  const { start, end } = resolveDateRange(query);
  const loc = saleLocationSql(query.locationId);
  const limit = query.limit ?? 5;

  const [
    totalCustomers,
    newBuyers,
    returningBuyers,
    spendRows,
    seriesRows,
    topRows,
  ] = await Promise.all([
    prisma.customer.count({
      where: { businessId, isActive: true },
    }),
    prisma.$queryRaw<{ count: string }[]>`
        SELECT COUNT(DISTINCT s."customerId")::text AS count
        FROM sales s
        WHERE s."businessId" = ${businessId}::uuid
          AND s.status = 'completed'
          AND s."customerId" IS NOT NULL
          AND s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${loc}
          AND NOT EXISTS (
            SELECT 1 FROM sales prior
            WHERE prior."customerId" = s."customerId"
              AND prior."businessId" = ${businessId}::uuid
              AND prior.status = 'completed'
              AND prior."createdAt" < ${start}
          )
      `,
    prisma.$queryRaw<{ count: string }[]>`
        SELECT COUNT(DISTINCT s."customerId")::text AS count
        FROM sales s
        WHERE s."businessId" = ${businessId}::uuid
          AND s.status = 'completed'
          AND s."customerId" IS NOT NULL
          AND s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${loc}
          AND EXISTS (
            SELECT 1 FROM sales prior
            WHERE prior."customerId" = s."customerId"
              AND prior."businessId" = ${businessId}::uuid
              AND prior.status = 'completed'
              AND prior."createdAt" < ${start}
          )
      `,
    prisma.$queryRaw<{ totalSpent: string; buyers: string }[]>`
        SELECT
          COALESCE(SUM(s."totalAmount"), 0)::text AS "totalSpent",
          COUNT(DISTINCT s."customerId")::text AS buyers
        FROM sales s
        WHERE s."businessId" = ${businessId}::uuid
          AND s.status = 'completed'
          AND s."customerId" IS NOT NULL
          AND s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${loc}
      `,
    prisma.$queryRaw<{ period: Date; spend: string; customers: string }[]>`
        SELECT DATE_TRUNC('day', s."createdAt") AS period,
          COALESCE(SUM(s."totalAmount"), 0)::text AS spend,
          COUNT(DISTINCT s."customerId")::text AS customers
        FROM sales s
        WHERE s."businessId" = ${businessId}::uuid
          AND s.status = 'completed'
          AND s."customerId" IS NOT NULL
          AND s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${loc}
        GROUP BY period
        ORDER BY period ASC
      `,
    prisma.$queryRaw<
      {
        customerId: string;
        customerName: string | null;
        totalSpent: string;
        saleCount: string;
      }[]
    >`
        SELECT s."customerId" AS "customerId",
          COALESCE(MAX(c.name), MAX(s."customerName"), 'Customer') AS "customerName",
          COALESCE(SUM(s."totalAmount"), 0)::text AS "totalSpent",
          COUNT(*)::text AS "saleCount"
        FROM sales s
        LEFT JOIN customers c ON c.id = s."customerId"
        WHERE s."businessId" = ${businessId}::uuid
          AND s.status = 'completed'
          AND s."customerId" IS NOT NULL
          AND s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${loc}
        GROUP BY s."customerId"
        ORDER BY SUM(s."totalAmount") DESC
        LIMIT ${limit}
      `,
  ]);

  const totalSpent = parseFloat(spendRows[0]?.totalSpent ?? '0');
  const buyers = parseInt(spendRows[0]?.buyers ?? '0', 10);

  return {
    totalCustomers,
    newCustomers: parseInt(newBuyers[0]?.count ?? '0', 10),
    returningCustomers: parseInt(returningBuyers[0]?.count ?? '0', 10),
    averageSpend: averageSpend(totalSpent, buyers),
    period: { start: start.toISOString(), end: end.toISOString() },
    series: seriesRows.map((row) => ({
      period: row.period,
      spend: parseFloat(row.spend),
      customers: parseInt(row.customers, 10),
    })),
    topCustomers: topRows.map((row) => ({
      customerId: row.customerId,
      customerName: row.customerName ?? 'Customer',
      totalSpent: parseFloat(row.totalSpent),
      saleCount: parseInt(row.saleCount, 10),
    })),
  };
}
