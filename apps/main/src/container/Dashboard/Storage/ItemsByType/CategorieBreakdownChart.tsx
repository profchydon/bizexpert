"use client";
import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  chartData: any[];
}

const chartConfig = {
  category: {
    label: "Category",
  },
} satisfies ChartConfig;

const CategorieBreakdownChart: React.FC<Props> = ({ chartData }) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[250px] max-h-[250px] aspect-square"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_: any, payload: any) => {
                const category = payload?.[0]?.payload?.category;
                const count = payload?.[0]?.payload?.count;
                return (
                  <div className="flex flex-col gap-y-1">
                    <span className="text-[#344054] text-center font-semibold text-xs">
                      {count}
                    </span>
                    <span className="text-xs text-[#475467] text-center">
                      {category}
                    </span>
                  </div>
                );
              }}
              formatter={() => null}
            />
          }
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="category"
          innerRadius={50}
        />
      </PieChart>
    </ChartContainer>
  );
};

export default CategorieBreakdownChart;
