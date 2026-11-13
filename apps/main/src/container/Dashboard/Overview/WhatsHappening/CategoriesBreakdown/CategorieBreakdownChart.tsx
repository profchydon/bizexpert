"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { categoriesBreakdownLayoutClass } from "../../overviewDashboardLayout";

interface ChartDatum {
  category: string;
  count: number;
  fill: string;
}

function TypesDonutTooltip({
  active,
  payload,
}: Readonly<{
  active?: boolean;
  payload?: Array<{ payload: ChartDatum }>;
}>) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  return (
    <div className="relative -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-xl bg-primary px-4 py-3 shadow-lg">
      <p className="text-center text-xs font-semibold whitespace-nowrap text-secondary">
        {entry.count}
      </p>
      <p className="text-center text-xs whitespace-nowrap text-tertiary">
        {entry.category}
      </p>
      <span className="absolute -bottom-[5px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-r border-b border-secondary bg-primary" />
    </div>
  );
}

const CategorieBreakdownChart = ({
  chartData,
}: {
  chartData: ChartDatum[];
}) => {
  return (
    <div className={categoriesBreakdownLayoutClass.chartCanvasClass}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="category"
            innerRadius={40}
            outerRadius={70}
            stroke="none"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
          >
            {chartData.map((entry) => (
              <Cell key={entry.category} fill={entry.fill} />
            ))}
          </Pie>
          <RechartsTooltip
            content={<TypesDonutTooltip />}
            isAnimationActive={false}
            offset={0}
            allowEscapeViewBox={{ x: true, y: true }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategorieBreakdownChart;
