"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import dayjs from "dayjs";
import { useIsLgViewport } from "@/hooks/useIsLgViewport";
import {
  getOrderFrequencyChartSettings,
  orderFrequencyChartCanvasClass,
} from "../../overviewDashboardLayout";

interface Props {
  data: Array<{ month: string; orders: number }>;
}

const chartConfig = {
  orders: {
    label: "Orders",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const OrderFrequencyChart: React.FC<Props> = ({ data }) => {
  const isLargeScreen = useIsLgViewport();
  const chartSettings = getOrderFrequencyChartSettings(isLargeScreen);

  return (
    <ChartContainer
      config={chartConfig}
      className={orderFrequencyChartCanvasClass}
    >
      <BarChart
        accessibilityLayer
        barSize={chartSettings.barSize}
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
      >
        <CartesianGrid vertical={false} opacity={0.2} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          interval={chartSettings.xAxisInterval}
          minTickGap={chartSettings.minTickGap}
          height={48}
          tick={{ fontSize: 11 }}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_: unknown, payload: unknown) => {
                const entry = (
                  payload as { payload?: { month?: string; orders?: number } }[]
                )?.[0]?.payload;
                return (
                  <div className="flex flex-col gap-y-1">
                    <span className="text-xs font-semibold text-[#344054]">
                      {entry?.orders} orders
                    </span>
                    <span className="text-xs text-[#475467]">
                      {entry?.month}, {dayjs().format("YYYY")}
                    </span>
                  </div>
                );
              }}
              formatter={() => null}
            />
          }
        />
        <Bar
          dataKey="orders"
          radius={8}
          fill="#79ABFF"
          activeBar={<Rectangle fill="#0C66FF" />}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default OrderFrequencyChart;
