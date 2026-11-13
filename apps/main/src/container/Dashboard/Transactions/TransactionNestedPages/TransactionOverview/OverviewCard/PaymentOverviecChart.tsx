import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", creditSpent: 5000, cashSpent: -3000 },
  { month: "Feb", creditSpent: 9000, cashSpent: -6000 },
  { month: "Mar", creditSpent: 4000, cashSpent: -2000 },
  { month: "Apr", creditSpent: 3000, cashSpent: -7000 },
  { month: "May", creditSpent: 6000, cashSpent: -5000 },
  { month: "Jun", creditSpent: 7000, cashSpent: -1000 },
  { month: "Jul", creditSpent: 8000, cashSpent: -4000 },
  { month: "Aug", creditSpent: 6500, cashSpent: -5000 },
  { month: "Sep", creditSpent: 7200, cashSpent: -3000 },
  { month: "Oct", creditSpent: 9500, cashSpent: -6000 },
  { month: "Nov", creditSpent: 8500, cashSpent: -5000 },
  { month: "Dec", creditSpent: 5000, cashSpent: -2000 },
];

const PaymentOverviecChart: React.FC = () => {
  const formatYAxisTick = (tick: number) => {
    return `$${Math.abs(tick)}`;
  };
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="month"
            axisLine={{ stroke: "#EAECF0", strokeWidth: 1 }}
            tickLine={{ stroke: "#475467", strokeWidth: 1 }}
          />
          <YAxis
            tickFormatter={formatYAxisTick as any}
            axisLine={false}
            tickLine={{ stroke: "#475467", strokeWidth: 1 }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="creditSpent" fill="#79ABFF" name="Credit spent" />
          <Bar dataKey="cashSpent" fill="#6CE9A6" name="Cash spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentOverviecChart;
