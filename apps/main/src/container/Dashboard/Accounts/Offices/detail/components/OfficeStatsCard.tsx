"use client";

import { useRef, useState } from "react";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import type { OfficeSnapshot } from "@/types/offices";
import { formatOfficeMoney } from "../utils/officeFormat";
import { AssetMixBar } from "./AssetMixBar";
import {
  detailCardBodyClass,
  detailCardClass,
  detailCardTitleClass,
} from "../../../components/detailCardClasses";
import {
  assetMixColorClasses,
  FALLBACK_DEVICE_BAR_CLASS,
} from "./deviceTypeMeta";

interface Props {
  snapshot: OfficeSnapshot | undefined;
  currency: string;
}

function Stat({ label, value }: { label: string; value: string }) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const syncTruncation = () => {
    const element = valueRef.current;
    if (!element) return;
    setIsTruncated(element.scrollWidth > element.clientWidth);
  };

  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <span className="truncate text-xs text-gray-500">{label}</span>
      <Tooltip title={value} placement="top" isDisabled={!isTruncated}>
        <TooltipTrigger
          className="w-full cursor-default"
          onHoverStart={syncTruncation}
          onFocus={syncTruncation}
        >
          <span
            ref={valueRef}
            className="block w-full truncate text-left text-lg font-semibold text-gray-900 tabular-nums xl:text-xl"
          >
            {value}
          </span>
        </TooltipTrigger>
      </Tooltip>
    </div>
  );
}

export function OfficeStatsCard({ snapshot, currency }: Props) {
  const employees = snapshot?.employees ?? 0;
  const assets = snapshot?.assets ?? 0;
  const assetValue = snapshot?.asset_value ?? 0;
  const slices = [...(snapshot?.asset_mix ?? [])].sort(
    (a, b) => b.count - a.count,
  );
  const colors = assetMixColorClasses(slices.map((slice) => slice.type));
  const segments = slices.map((slice) => ({
    key: slice.type,
    label: slice.type,
    count: slice.count,
    colorClass: colors.get(slice.type) ?? FALLBACK_DEVICE_BAR_CLASS,
  }));

  return (
    <section className={detailCardClass}>
      <h2 className={detailCardTitleClass}>Snapshot</h2>
      <div className={`${detailCardBodyClass} gap-4`}>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Employees" value={String(employees)} />
          <Stat label="Assets" value={String(assets)} />
          <Stat
            label="Asset value"
            value={formatOfficeMoney(assetValue, currency)}
          />
        </div>
        {segments.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-gray-600">Asset mix</span>
            <AssetMixBar segments={segments} total={assets} />
          </div>
        )}
      </div>
    </section>
  );
}
