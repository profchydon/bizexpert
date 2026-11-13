"use client";

import { useState } from "react";
import { AlertTriangle, Server01 } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";
import type { StorageInventoryOverview } from "../utils/mapInStorageInventorySummary";
import type { DeviceType, StorageStatus } from "../types/storage";
import { DistributionBar } from "./DistributionBar";

interface Props {
  overview: StorageInventoryOverview;
  onSelectStatus: (status: StorageStatus) => void;
  onSelectDeviceType: (type: DeviceType) => void;
  onSelectCountry: (countryId: string, countryName: string) => void;
  onPendingClick: () => void;
}

type Dimension = "asset" | "status" | "country";

const TAB_ITEMS = [
  { id: "asset", label: "By asset type" },
  { id: "status", label: "By status" },
  { id: "country", label: "By country" },
];

export function StorageOverview({
  overview,
  onSelectStatus,
  onSelectDeviceType,
  onSelectCountry,
  onPendingClick,
}: Props) {
  const [dimension, setDimension] = useState<Dimension>("asset");
  const { totalCount, assetTypeCount, needsActionCount } = overview;

  const bar = () => {
    if (dimension === "asset") {
      return (
        <DistributionBar
          segments={overview.assetSegments}
          total={totalCount}
          onSelect={(k) => onSelectDeviceType(k as DeviceType)}
        />
      );
    }
    if (dimension === "status") {
      return (
        <DistributionBar
          segments={overview.statusSegments}
          total={totalCount}
          onSelect={(k) => onSelectStatus(k as StorageStatus)}
        />
      );
    }
    return (
      <DistributionBar
        segments={overview.countrySegments}
        total={totalCount}
        onSelect={(countryId) => {
          const match = overview.countrySegments.find(
            (s) => s.key === countryId,
          );
          if (match) onSelectCountry(countryId, match.label);
        }}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex items-center gap-4 rounded-xl border border-secondary bg-primary p-5">
        <span className="flex size-10 items-center justify-center rounded-lg bg-brand-solid text-fg-white">
          <Server01 className="size-5" />
        </span>
        <div>
          <p className="text-2xl font-semibold text-primary">{totalCount}</p>
          <p className="text-sm text-tertiary">
            Total in storage · {assetTypeCount} asset{" "}
            {assetTypeCount === 1 ? "type" : "types"}
          </p>
        </div>
        <button
          type="button"
          onClick={onPendingClick}
          className="ml-auto flex flex-col items-end rounded-lg px-2 py-1 text-right hover:bg-secondary"
        >
          <span className="flex items-center gap-1 text-lg font-semibold text-warning-primary">
            <AlertTriangle className="size-4" />
            {needsActionCount}
          </span>
          <span className="text-xs text-quaternary">Need action</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-5 lg:col-span-2">
        <Tabs
          selectedKey={dimension}
          onSelectionChange={(k) => setDimension(k as Dimension)}
        >
          <Tabs.List
            type="button-border"
            size="sm"
            items={TAB_ITEMS}
            className="self-start"
          >
            {(item) => <Tabs.Item id={item.id}>{item.label}</Tabs.Item>}
          </Tabs.List>
        </Tabs>
        {bar()}
      </div>
    </div>
  );
}
