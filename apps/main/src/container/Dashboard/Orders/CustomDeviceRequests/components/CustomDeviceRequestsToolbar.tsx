import { Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { filterTabs } from "../constants";
import type {
  FilterAssetTypeOption,
  FilterCountryOption,
  FilterTab,
  RequestFilters,
} from "../types";
import FilterDropdown from "./FilterDropdown";

interface ToolbarProps {
  activeFilter: FilterTab;
  activeFilterCount: number;
  assetTypes: FilterAssetTypeOption[];
  budgetRangeLimits: [number, number];
  countries: FilterCountryOption[];
  filters: RequestFilters;
  onFilterChange: (key: FilterTab) => void;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  resultCount: number;
  searchQuery: string;
  setFilters: (filters: RequestFilters) => void;
  showFilterModal: boolean;
}

export default function CustomDeviceRequestsToolbar({
  activeFilter,
  activeFilterCount,
  assetTypes,
  budgetRangeLimits,
  countries,
  filters,
  onFilterChange,
  onSearchChange,
  onToggleFilters,
  resultCount,
  searchQuery,
  setFilters,
  showFilterModal,
}: Readonly<ToolbarProps>) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Rfqs <span className="text-gray-500">({resultCount})</span>
      </h2>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={activeFilter}
          onValueChange={(value) => onFilterChange(value as FilterTab)}
          className="w-full lg:w-auto border-[1px] border-gray-200 rounded-lg bg-gray-50"
        >
          <TabsList className="h-auto rounded-none bg-transparent p-0">
            {filterTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-lg px-3 py-2 text-sm data-[state=active]:text-gray-700 data-[state=active]:border-gray-300 data-[state=active]:border"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
          <div className="w-full lg:w-72">
            <Input
              value={searchQuery}
              placeholder="Search by request ID or device"
              onChange={(event) => onSearchChange(event.target.value)}
              startAdornment={<Search className="size-4 text-gray-400" />}
              data-testid="customdevicerequeststoolbar-input"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={onToggleFilters}
              className={cn(
                "flex h-10 w-full items-center justify-center gap-2 rounded-md border px-3.5 text-sm font-semibold transition-colors lg:w-auto",
                showFilterModal
                  ? "border-primary-700 bg-primary-50 text-primary-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              )}
            >
              <Filter className="size-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="border-0 bg-primary-700 text-white hover:bg-primary-700">
                  {activeFilterCount}
                </Badge>
              )}
            </button>

            <FilterDropdown
              assetTypes={assetTypes}
              budgetRangeLimits={budgetRangeLimits}
              countries={countries}
              isOpen={showFilterModal}
              onClose={onToggleFilters}
              filters={filters}
              onApply={setFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
