import { NativeSelect } from "@/components/base/select/select-native";
import SearchWithIcon from "@/components/SearchWithIcon";
import { Button } from "@/components/ui/button";
import type { Location } from "@/types/bizexpert";
import { SALE_SOURCE_OPTIONS, SALE_STATUS_OPTIONS } from "./saleFilterOptions";
import {
  emptySalesFilters,
  salesFiltersAreActive,
  type SalesTableFilterState,
} from "./salesFiltersAreActive";
import {
  salesDateInputClass,
  salesFilterControlClass,
} from "./salesPageClasses";

export type { SalesTableFilterState };

type Props = {
  filters: SalesTableFilterState;
  locations: Location[];
  onChange: (next: SalesTableFilterState) => void;
};

export function SalesTableFilters({ filters, locations, onChange }: Props) {
  const set = (patch: Partial<SalesTableFilterState>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
      <NativeSelect
        value={filters.locationId}
        onChange={(event) => set({ locationId: event.target.value })}
        className={salesFilterControlClass}
        options={[
          { value: "", label: "All stores" },
          ...locations.map((row) => ({ value: row.id, label: row.name })),
        ]}
      />
      <NativeSelect
        value={filters.status}
        onChange={(event) => set({ status: event.target.value })}
        className={salesFilterControlClass}
        options={SALE_STATUS_OPTIONS.map((row) => ({
          value: row.value,
          label: row.label,
        }))}
      />
      <NativeSelect
        value={filters.source}
        onChange={(event) => set({ source: event.target.value })}
        className={salesFilterControlClass}
        options={SALE_SOURCE_OPTIONS.map((row) => ({
          value: row.value,
          label: row.label,
        }))}
      />
      <input
        type="date"
        aria-label="Start date"
        value={filters.startDate}
        onChange={(event) => set({ startDate: event.target.value })}
        className={salesDateInputClass}
      />
      <input
        type="date"
        aria-label="End date"
        value={filters.endDate}
        onChange={(event) => set({ endDate: event.target.value })}
        className={salesDateInputClass}
      />
      <SearchWithIcon
        className="w-full sm:w-[310px]"
        placeholder="Search sale number or customer"
        value={filters.search}
        onChange={(event) => set({ search: event.target.value })}
      />
      {salesFiltersAreActive(filters) ? (
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => onChange(emptySalesFilters)}
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
}
