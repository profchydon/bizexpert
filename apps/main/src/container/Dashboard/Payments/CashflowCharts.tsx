"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageState from "@/components/PageState";
import { formatNgn } from "@/lib/bizexpert/format";
import { formatInventoryAxisAmount } from "../Overview/formatInventoryChart";
import { InventoryTableShell } from "../Inventory/InventoryTableShell";
import { toCashflowChartRows } from "./cashflowMetrics";
import type { CashflowDay } from "./paymentsAnalyticsTypes";
import {
  paymentsAnalyticsChartBodyClass,
  paymentsAnalyticsTwoColumnClass,
} from "./paymentsPageClasses";

type Props = {
  days: CashflowDay[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

function CashflowLineChart({
  title,
  rows,
  amount,
}: {
  title: string;
  rows: ReturnType<typeof toCashflowChartRows>;
  amount: boolean;
}) {
  return (
    <InventoryTableShell title={title}>
      {rows.length === 0 ? (
        <div className="flex h-80 items-center justify-center px-6 text-center text-sm text-gray-600">
          No cashflow in this period.
        </div>
      ) : (
        <div className={paymentsAnalyticsChartBodyClass}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border-secondary)"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--color-text-tertiary)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fill: "var(--color-text-tertiary)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                dx={-10}
                tickFormatter={amount ? formatInventoryAxisAmount : String}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  amount ? formatNgn(value) : value,
                  name,
                ]}
              />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-gray-700">{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey={amount ? "inflowAmount" : "inflowCount"}
                name={amount ? "Inflow" : "Inflow count"}
                stroke="var(--color-success-600)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={amount ? "outflowAmount" : "outflowCount"}
                name={amount ? "Outflow" : "Outflow count"}
                stroke="var(--color-error-600)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </InventoryTableShell>
  );
}

export function CashflowCharts({ days, isLoading, isError }: Props) {
  const rows = toCashflowChartRows(days ?? []);
  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className={paymentsAnalyticsTwoColumnClass}>
        <CashflowLineChart title="Daily amount" rows={rows} amount />
        <CashflowLineChart title="Daily count" rows={rows} amount={false} />
      </div>
    </PageState>
  );
}
