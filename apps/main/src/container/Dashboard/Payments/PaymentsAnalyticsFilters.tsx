"use client";

import { NativeSelect } from "@/components/base/select/select-native";
import type { Location } from "@/types/bizexpert";
import type { PaymentsAnalyticsFilters as Filters } from "./paymentsAnalyticsRange";
import { paymentsDateInputClass } from "./paymentsPageClasses";

type Props = {
  filters: Filters;
  locations: Location[];
  onChange: (next: Filters) => void;
};

export function PaymentsAnalyticsFilters({
  filters,
  locations,
  onChange,
}: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
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
        className={paymentsDateInputClass}
      />
      <input
        type="date"
        aria-label="End date"
        value={filters.endDate}
        onChange={(event) => set({ endDate: event.target.value })}
        className={paymentsDateInputClass}
      />
    </div>
  );
}
