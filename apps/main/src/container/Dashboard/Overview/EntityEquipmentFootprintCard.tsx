"use client";

import { AssetMixBar } from "@/container/Dashboard/Accounts/Offices/detail/components/AssetMixBar";
import { assetMixColorClasses } from "@/container/Dashboard/Accounts/Offices/detail/components/deviceTypeMeta";
import type { IEquipmentByCategory } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { ConditionDonut } from "./ConditionDonut";
import type { EquipmentConditionSlice } from "./dashboardEntityFootprint";
import {
  overviewCardDividerClass,
  overviewCardShellClass,
} from "./overviewDashboardClasses";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border-secondary bg-secondary px-4 py-3">
      <span className="text-xs text-tertiary">{label}</span>
      <span className="text-xl font-semibold text-primary tabular-nums">
        {value}
      </span>
    </div>
  );
}

export function EntityEquipmentFootprintCard({
  region,
  inStorage,
  assetCount,
  assetValue,
  categories,
  conditions,
}: Readonly<{
  region: string;
  inStorage: number;
  assetCount: number;
  assetValue: string;
  categories: IEquipmentByCategory[];
  conditions: EquipmentConditionSlice[];
}>) {
  const slices = [...categories].sort(
    (left, right) => right.count - left.count,
  );
  const colors = assetMixColorClasses(slices.map((slice) => slice.category));
  const segments = slices.map((slice) => ({
    key: slice.category,
    label: slice.category,
    count: slice.count,
    colorClass: colors.get(slice.category) ?? "bg-gray-500",
  }));
  const place = region.trim() || "this entity";
  const hasMix = segments.length > 0 && assetCount > 0;

  return (
    <div className={overviewCardShellClass}>
      <div className="border-b border-border-secondary px-6 py-4">
        <h2 className="text-md font-semibold text-primary">Equipment</h2>
        <p className="mt-0.5 text-sm text-tertiary">
          Condition and mix across {place}.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <ConditionDonut conditions={conditions} total={assetCount} />
        <div className="grid grid-cols-2 gap-2 border-t border-border-secondary pt-5">
          <Stat label="In storage" value={String(inStorage)} />
          <Stat label="Asset value" value={assetValue} />
        </div>
        <div className={cn(overviewCardDividerClass, "mt-auto pt-4")}>
          <span className="text-xs font-medium text-tertiary">
            Equipment mix
          </span>
          <div className="mt-3">
            {hasMix ? (
              <AssetMixBar segments={segments} total={assetCount} />
            ) : (
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
