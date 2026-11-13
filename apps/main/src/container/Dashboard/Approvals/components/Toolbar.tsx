import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

import { approvalTabs } from "../data";
import type { ApprovalFilterTab } from "../types";

export function ApprovalsToolbar({
  activeTab,
  onSearchChange,
  onTabChange,
  resultCount,
  search,
}: {
  activeTab: ApprovalFilterTab;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: ApprovalFilterTab) => void;
  resultCount: number;
  search: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
      <div className="overflow-x-auto">
        <div className="relative z-0 inline-flex w-max -space-x-px rounded-lg shadow-sm">
          {approvalTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "inline-flex items-center bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 transition first:rounded-l-lg last:rounded-r-lg hover:bg-gray-50 hover:text-gray-900",
                activeTab === tab.key
                  ? "z-10 bg-gray-50 text-gray-900"
                  : "text-gray-600",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-white px-3 text-sm font-normal text-gray-700 shadow-sm">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
        <label className="relative block min-w-0 flex-1 sm:w-72 sm:flex-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by employee, kit, or policy"
            className="h-9 w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm font-normal text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
        </label>
      </div>
    </div>
  );
}
