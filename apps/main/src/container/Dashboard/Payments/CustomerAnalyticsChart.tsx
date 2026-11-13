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
import { toCustomerAnalyticsChartRows } from "./customerAnalyticsMetrics";
import type { CustomerAnalyticsDay } from "./paymentsAnalyticsTypes";
import { paymentsAnalyticsChartBodyClass } from "./paymentsPageClasses";

type Props = {
  days: CustomerAnalyticsDay[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function CustomerAnalyticsChart({ days, isLoading, isError }: Props) {
  const rows = toCustomerAnalyticsChartRows(days ?? []);
  return (
    <InventoryTableShell title="Customer spend">
      <PageState isLoading={isLoading} isError={isError}>
        {rows.length === 0 ? (
          <div className="flex h-80 items-center justify-center px-6 text-center text-sm text-gray-600">
            No customer sales in this period.
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
                  tickFormatter={formatInventoryAxisAmount}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "Spend" ? formatNgn(value) : value,
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
                  dataKey="spend"
                  name="Spend"
                  stroke="var(--color-brand-600)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  name="Customers"
                  stroke="var(--color-success-600)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </PageState>
    </InventoryTableShell>
  );
}
