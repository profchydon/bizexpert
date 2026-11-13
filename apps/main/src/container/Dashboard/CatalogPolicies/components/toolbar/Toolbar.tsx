"use client";

import { useState } from "react";
import { Grid3X3, List, ListFilter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { RuleFilterMenu } from "./FilterMenu";
import type { RuleFilters, RuleStatusFilter, RuleView } from "../../types";
import { getRuleFilterCount, ruleStatusOptions } from "../../utils";

export function RuleToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  view,
  onViewChange,
  filters,
  onFiltersChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: RuleStatusFilter;
  onStatusFilterChange: (value: RuleStatusFilter) => void;
  view: RuleView;
  onViewChange: (value: RuleView) => void;
  filters: RuleFilters;
  onFiltersChange: (value: RuleFilters) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount = getRuleFilterCount(filters);
  const control =
    "inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap px-3.5 text-sm font-medium transition";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="inline-flex w-max rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm">
        {ruleStatusOptions.map((status) => (
          <button
            key={status}
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition",
              statusFilter === status
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:text-gray-700",
            )}
            onClick={() => onStatusFilterChange(status)}
          >
            {status === "All" ? "View all" : status}
          </button>
        ))}
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        <div className="relative w-full min-w-[180px] sm:w-52">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search rules"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-10 rounded-lg pl-9 text-sm"
            data-testid="toolbar-input"
          />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            className={cn(control, "gap-1.5 bg-white")}
            onClick={() => setFiltersOpen((current) => !current)}
            data-testid="toolbar-button"
          >
            <ListFilter className="h-4 w-4" />
            {activeFilterCount > 0
              ? `Filters (${activeFilterCount})`
              : "Filters"}
          </Button>
          <RuleFilterMenu
            open={filtersOpen}
            filters={filters}
            onClose={() => setFiltersOpen(false)}
            onApply={onFiltersChange}
          />
        </div>
        <div className="inline-flex min-w-max shrink-0 -space-x-px rounded-lg shadow-sm">
          <ViewButton
            active={view === "card"}
            className="rounded-l-lg"
            onClick={() => onViewChange("card")}
            icon={<Grid3X3 className="size-4" />}
          >
            Card view
          </ViewButton>
          <ViewButton
            active={view === "table"}
            className="rounded-r-lg"
            onClick={() => onViewChange("table")}
            icon={<List className="size-4" />}
          >
            Table view
          </ViewButton>
        </div>
      </div>
    </div>
  );
}

function ViewButton({
  active,
  className,
  icon,
  children,
  onClick,
}: {
  active: boolean;
  className: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center gap-1.5 border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50",
        active && "bg-gray-50 text-gray-900",
        className,
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
