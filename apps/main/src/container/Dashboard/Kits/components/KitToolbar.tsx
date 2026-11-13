"use client";

import { useState } from "react";
import { Grid3X3, List, ListFilter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import KitFilterPopover from "./KitFilterPopover";
import type { KitFilters } from "./KitFilterPopover";

export type StatusFilter = "All" | "Draft" | "Active" | "Archived";
export type KitView = "card" | "table";

const statusOptions: StatusFilter[] = ["All", "Draft", "Active", "Archived"];

interface Props {
  search: string;
  statusFilter: StatusFilter;
  filters: KitFilters;
  resultCount: number;
  view: KitView;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onFiltersChange: (filters: KitFilters) => void;
  onViewChange: (view: KitView) => void;
}

const KitToolbar = (props: Props) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const control =
    "inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap px-3.5 text-sm font-semibold transition";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-fit max-w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
        {statusOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => props.onStatusFilterChange(option)}
            className={cn(
              control,
              "border-r border-gray-200 last:border-r-0",
              props.statusFilter === option
                ? "bg-gray-50 text-gray-900"
                : "text-gray-600 hover:bg-gray-50",
            )}
          >
            {option === "All" ? "View all" : option}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        <div className="relative w-full min-w-[180px] sm:w-52">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search"
            value={props.search}
            onChange={(event) => props.onSearchChange(event.target.value)}
            className="h-10 rounded-lg pl-9 text-sm"
            data-testid="kittoolbar-input"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            className={cn(
              control,
              "gap-2 rounded-lg border border-gray-200 bg-white text-gray-700 shadow-[0_1px_2px_rgba(10,13,18,0.05)] hover:bg-gray-50",
            )}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <ListFilter className="size-4 text-gray-500" />
            Filters
          </button>
          {filtersOpen && (
            <KitFilterPopover
              filters={props.filters}
              resultCount={props.resultCount}
              onApply={props.onFiltersChange}
              onClose={() => setFiltersOpen(false)}
            />
          )}
        </div>
        <div className="inline-flex min-w-max shrink-0 -space-x-px rounded-lg shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
          <button
            type="button"
            className={cn(
              control,
              "gap-1.5 rounded-l-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              props.view === "card" && "bg-gray-50 text-gray-900",
            )}
            onClick={() => props.onViewChange("card")}
          >
            <Grid3X3
              className={cn(
                "size-4 text-gray-500",
                props.view === "card" && "text-gray-700",
              )}
            />
            Card view
          </button>
          <button
            type="button"
            className={cn(
              control,
              "gap-1.5 rounded-r-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              props.view === "table" && "bg-gray-50 text-gray-900",
            )}
            onClick={() => props.onViewChange("table")}
          >
            <List
              className={cn(
                "size-4 text-gray-500",
                props.view === "table" && "text-gray-700",
              )}
            />
            Table view
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitToolbar;
