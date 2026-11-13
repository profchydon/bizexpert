"use client";

import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import {
  overviewCardDividerClass,
  overviewCardShellClass,
} from "./overviewDashboardClasses";

export function EntityOfficesFootprintCard({
  region,
  total,
  physical,
  remote,
  areas,
}: {
  region: string;
  total: number;
  physical: number;
  remote: number;
  areas: { name: string; count: number }[];
}) {
  const maxArea = Math.max(1, ...areas.map((area) => area.count));
  const place = region.trim() || "this entity";

  return (
    <div className={overviewCardShellClass}>
      <div className="border-b border-border-secondary px-6 py-4">
        <h2 className="text-md font-semibold text-primary">Offices</h2>
        <p className="mt-0.5 text-sm text-tertiary">
          Where your team works across {place}.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-display-xs font-semibold text-primary tabular-nums">
              {total}
            </span>
            <span className="text-sm text-tertiary">
              {total === 1 ? "office" : "offices"}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 rounded-xl border border-border-secondary bg-secondary px-4 py-3">
              <span className="text-xs text-tertiary">Physical</span>
              <span className="text-xl font-semibold text-primary tabular-nums">
                {physical}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-border-secondary bg-secondary px-4 py-3">
              <span className="text-xs text-tertiary">Remote</span>
              <span className="text-xl font-semibold text-primary tabular-nums">
                {remote}
              </span>
            </div>
          </div>
        </div>
        <div className={`flex flex-col gap-3 ${overviewCardDividerClass} pt-4`}>
          <span className="text-xs font-medium text-tertiary">
            Office areas
          </span>
          {areas.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {areas.map((area) => (
                <li key={area.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">{area.name}</span>
                    <span className="font-semibold text-primary tabular-nums">
                      {area.count}
                    </span>
                  </div>
                  <ProgressBar
                    value={area.count}
                    max={maxArea}
                    progressClassName="bg-fg-brand-primary"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
