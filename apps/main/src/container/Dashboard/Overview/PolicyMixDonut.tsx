"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { policyMixChartData, policyMixSegments } from "./policyMixDonutData";

export function PolicyMixDonut({
  active,
  inactive,
}: Readonly<{
  active: number;
  inactive: number;
}>) {
  const total = active + inactive;
  const segments = policyMixSegments(active, inactive);
  const chartData = policyMixChartData(segments);

  return (
    <div className="flex items-center gap-5">
      <div className="relative size-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={64}
              outerRadius={80}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-display-xs font-semibold text-primary tabular-nums">
            {total}
          </span>
          <span className="text-xs text-tertiary">policies</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="flex-1 text-sm text-secondary">
              {segment.label}
            </span>
            <span className="text-sm font-semibold text-primary tabular-nums">
              {segment.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
