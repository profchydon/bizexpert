"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { EquipmentConditionSlice } from "./dashboardEntityFootprint";

export function ConditionDonut({
  conditions,
  total,
}: Readonly<{
  conditions: EquipmentConditionSlice[];
  total: number;
}>) {
  const filled = conditions.filter((condition) => condition.value > 0);
  const slices =
    filled.length > 0
      ? filled
      : [
          {
            key: "empty",
            label: "Empty",
            value: 1,
            color: "var(--color-utility-gray-200)",
          },
        ];

  return (
    <div className="flex items-center gap-5">
      <div className="relative size-[140px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius={46}
              outerRadius={68}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {slices.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-primary tabular-nums">
            {total}
          </span>
          <span className="text-xs text-tertiary">assets</span>
        </div>
      </div>
      <ul className="flex flex-1 flex-col gap-2">
        {conditions.map((condition) => (
          <li key={condition.key} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: condition.color }}
            />
            <span className="flex-1 text-sm text-secondary">
              {condition.label}
            </span>
            <span className="text-sm font-semibold text-primary tabular-nums">
              {condition.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
