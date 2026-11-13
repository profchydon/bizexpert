import { NativeSelect } from "@/components/base/select/select-native";
import SearchWithIcon from "@/components/SearchWithIcon";
import type { Location } from "@/types/bizexpert";

export type StockRemovalsFilterState = {
  search: string;
  locationId: string;
  startDate: string;
  endDate: string;
};

type Props = {
  filters: StockRemovalsFilterState;
  locations: Location[];
  onChange: (next: StockRemovalsFilterState) => void;
};

export function StockRemovalsTableFilters({
  filters,
  locations,
  onChange,
}: Props) {
  const set = (patch: Partial<StockRemovalsFilterState>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
      <NativeSelect
        value={filters.locationId}
        onChange={(event) => set({ locationId: event.target.value })}
        className="w-[180px]"
        options={[
          { value: "", label: "All stores" },
          ...locations.map((row) => ({ value: row.id, label: row.name })),
        ]}
      />
      <input
        type="date"
        aria-label="Start date"
        value={filters.startDate}
        onChange={(event) => set({ startDate: event.target.value })}
        className="h-11 rounded-lg border border-gray-300 px-3 text-sm text-gray-700"
      />
      <input
        type="date"
        aria-label="End date"
        value={filters.endDate}
        onChange={(event) => set({ endDate: event.target.value })}
        className="h-11 rounded-lg border border-gray-300 px-3 text-sm text-gray-700"
      />
      <SearchWithIcon
        className="w-[250px]"
        placeholder="Search product or reason"
        value={filters.search}
        onChange={(event) => set({ search: event.target.value })}
      />
    </div>
  );
}
