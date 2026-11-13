"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const BAR_MAX = 85;

function barFillClass(isActive: boolean, isHovered: boolean) {
  if (isActive) {
    return "bg-brand-solid";
  }

  if (isHovered) {
    return "bg-utility-brand-400";
  }

  return "bg-utility-brand-300";
}

export type SpendingChartPoint = {
  label: string;
  value: number;
};

export function SpendingBarChart({
  data,
  activeLabel,
  noData,
  currencySymbol,
}: Readonly<{
  data: SpendingChartPoint[];
  activeLabel?: string;
  noData?: boolean;
  currencySymbol: string;
}>) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((point) => point.value), 1);
  const dense = data.length > 14;
  const labelEvery = dense ? Math.ceil(data.length / 6) : 1;
  const gap = dense ? "gap-0.5" : "gap-1";

  return (
    <div className="relative flex flex-1 flex-col justify-end py-3 duration-200 animate-in fade-in">
      <div
        className={cn(
          "flex items-end px-2",
          gap,
          noData && "pointer-events-none blur-md select-none",
        )}
        style={{ height: 200 }}
      >
        {data.map((point, index) => (
          <div
            key={point.label}
            className="flex flex-1 items-end justify-center"
            style={{ height: "100%" }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className={cn(
                "relative w-full max-w-4 rounded-t transition-colors",
                barFillClass(point.label === activeLabel, hovered === index),
              )}
              style={{
                height: `${Math.max((point.value / max) * BAR_MAX, 3)}%`,
              }}
            >
              {hovered === index && !noData ? (
                <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2">
                  <div className="relative rounded-xl bg-primary px-4 py-3 shadow-lg">
                    <p className="text-center text-xs font-semibold whitespace-nowrap text-secondary">
                      {currencySymbol}
                      {point.value.toLocaleString("en-US")}
                    </p>
                    <p className="text-center text-xs whitespace-nowrap text-tertiary">
                      {point.label}
                    </p>
                    <span className="absolute -bottom-[5px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-r border-b border-secondary bg-primary" />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div
        className={cn(
          "flex items-center px-2 pt-3",
          gap,
          noData && "blur-md select-none",
        )}
      >
        {data.map((point, index) => (
          <span
            key={point.label}
            className="flex-1 text-center text-[11px] whitespace-nowrap text-tertiary"
          >
            {index % labelEvery === 0 || index === data.length - 1
              ? point.label
              : ""}
          </span>
        ))}
      </div>
      {noData ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-lg bg-primary-solid px-3 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-lg">
            No available data yet
          </span>
        </div>
      ) : null}
    </div>
  );
}
