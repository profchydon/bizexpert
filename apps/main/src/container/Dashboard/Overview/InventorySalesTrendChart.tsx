"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNgn } from "@/lib/bizexpert/format";
import PageState from "@/components/PageState";
import { InventoryTableShell } from "../Inventory/InventoryTableShell";
import {
  formatInventoryAxisAmount,
  toInventoryChartRows,
} from "./formatInventoryChart";
import { inventoryOverviewChartBodyClass } from "./inventoryOverviewClasses";
import type { InventoryChartPoint } from "./inventoryOverviewTypes";

type Props = {
  data: InventoryChartPoint[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function InventorySalesTrendChart({ data, isLoading, isError }: Props) {
  const rows = toInventoryChartRows(data ?? []);

  return (
    <InventoryTableShell title="Sales trend">
      <PageState isLoading={isLoading} isError={isError}>
        {rows.length === 0 ? (
          <div className="flex h-80 items-center justify-center px-6 text-center text-sm text-gray-600">
            No completed sales in the last 30 days.
          </div>
        ) : (
          <div className={inventoryOverviewChartBodyClass}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows}>
                <defs>
                  <linearGradient
                    id="inventoryRevenueFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--color-brand-600)"
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-brand-600)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
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
                    formatNgn(value),
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--color-brand-600)"
                  fill="url(#inventoryRevenueFill)"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Gross profit"
                  stroke="var(--color-success-600)"
                  fill="none"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </PageState>
    </InventoryTableShell>
  );
}
