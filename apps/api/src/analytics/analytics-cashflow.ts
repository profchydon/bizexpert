import { Prisma } from '@prisma/client';
import { resolveDateRange, type AnalyticsQuery } from './analytics-range';
import type { PrismaService } from '../prisma/prisma.service';

export type CashflowDay = {
  period: Date;
  inflowAmount: number;
  inflowCount: number;
  outflowAmount: number;
  outflowCount: number;
};

type AmountCountRow = {
  period: Date;
  amount: string;
  count: string;
};

function saleLocationSql(locationId?: string) {
  return locationId
    ? Prisma.sql`AND s."locationId" = ${locationId}::uuid`
    : Prisma.empty;
}

function purchaseLocationSql(locationId?: string) {
  return locationId
    ? Prisma.sql`AND pu."locationId" = ${locationId}::uuid`
    : Prisma.empty;
}

export function mergeCashflowDays(
  inflows: AmountCountRow[],
  outflows: AmountCountRow[],
): CashflowDay[] {
  const byDay = new Map<string, CashflowDay>();
  const touch = (row: AmountCountRow, side: 'in' | 'out') => {
    const key = new Date(row.period).toISOString();
    const current = byDay.get(key) ?? {
      period: new Date(row.period),
      inflowAmount: 0,
      inflowCount: 0,
      outflowAmount: 0,
      outflowCount: 0,
    };
    if (side === 'in') {
      current.inflowAmount = parseFloat(row.amount);
      current.inflowCount = parseInt(row.count, 10);
    } else {
      current.outflowAmount = parseFloat(row.amount);
      current.outflowCount = parseInt(row.count, 10);
    }
    byDay.set(key, current);
  };
  inflows.forEach((row) => touch(row, 'in'));
  outflows.forEach((row) => touch(row, 'out'));
  return [...byDay.values()].sort(
    (a, b) => a.period.getTime() - b.period.getTime(),
  );
}

export function summarizeCashflow(days: CashflowDay[]) {
  return days.reduce(
    (sum, row) => ({
      inflowAmount: sum.inflowAmount + row.inflowAmount,
      inflowCount: sum.inflowCount + row.inflowCount,
      outflowAmount: sum.outflowAmount + row.outflowAmount,
      outflowCount: sum.outflowCount + row.outflowCount,
    }),
    { inflowAmount: 0, inflowCount: 0, outflowAmount: 0, outflowCount: 0 },
  );
}

export async function getCashflowAnalytics(
  prisma: PrismaService,
  businessId: string,
  query: AnalyticsQuery,
) {
  const { start, end } = resolveDateRange(query);
  const saleLoc = saleLocationSql(query.locationId);
  const purchaseLoc = purchaseLocationSql(query.locationId);

  const [inflows, outflows] = await Promise.all([
    prisma.$queryRaw<AmountCountRow[]>`
      SELECT DATE_TRUNC('day', p."paidAt") AS period,
        COALESCE(SUM(p.amount), 0)::text AS amount,
        COUNT(*)::text AS count
      FROM payments p
      INNER JOIN sales s ON s.id = p."saleId"
      WHERE s."businessId" = ${businessId}::uuid
        AND s.status = 'completed'
        AND p."paidAt" >= ${start}
        AND p."paidAt" <= ${end}
        ${saleLoc}
      GROUP BY period
      ORDER BY period ASC
    `,
    prisma.$queryRaw<AmountCountRow[]>`
      SELECT DATE_TRUNC('day', pu."createdAt") AS period,
        COALESCE(SUM(pu."totalAmount"), 0)::text AS amount,
        COUNT(*)::text AS count
      FROM purchases pu
      WHERE pu."businessId" = ${businessId}::uuid
        AND pu.status IN ('received', 'partial')
        AND pu."createdAt" >= ${start}
        AND pu."createdAt" <= ${end}
        ${purchaseLoc}
      GROUP BY period
      ORDER BY period ASC
    `,
  ]);

  const series = mergeCashflowDays(inflows, outflows);
  return {
    ...summarizeCashflow(series),
    period: { start: start.toISOString(), end: end.toISOString() },
    series,
  };
}
