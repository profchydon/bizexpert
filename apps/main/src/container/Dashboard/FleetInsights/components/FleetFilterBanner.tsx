"use client";

import { X } from "lucide-react";
import type { FleetListFilter } from "../utils/fleetFilters";
import { filterLabel } from "../utils/fleetFilters";

export function FleetFilterBanner({
  filter,
  count,
  onClear,
}: Readonly<{
  filter: FleetListFilter;
  count: number;
  onClear: () => void;
}>) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
      <p className="text-sm font-medium text-primary-800">
        Showing {filterLabel(filter, count)}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-900"
      >
        Clear filter
        <X className="size-4" />
      </button>
    </div>
  );
}
