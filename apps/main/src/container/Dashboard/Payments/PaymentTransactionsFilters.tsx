"use client";

import SearchWithIcon from "@/components/SearchWithIcon";
import { NativeSelect } from "@/components/base/select/select-native";
import type { Location } from "@/types/bizexpert";
import { SALE_PAYMENT_METHOD_FILTER } from "../Sales/saleFilterOptions";
import type { PaymentTransactionFilters } from "./paymentTransactionFilters";
import { paymentsDateInputClass } from "./paymentsPageClasses";

type Props = {
  filters: PaymentTransactionFilters;
  locations: Location[];
  onChange: (next: PaymentTransactionFilters) => void;
};

export function PaymentTransactionsFilters({
  filters,
  locations,
  onChange,
}: Props) {
  const set = (patch: Partial<PaymentTransactionFilters>) =>
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
        className={paymentsDateInputClass}
      />
      <input
        type="date"
        aria-label="End date"
        value={filters.endDate}
        onChange={(event) => set({ endDate: event.target.value })}
        className={paymentsDateInputClass}
      />
      <NativeSelect
        value={filters.method}
        onChange={(event) => set({ method: event.target.value })}
        className="w-[180px]"
        options={SALE_PAYMENT_METHOD_FILTER.map((row) => ({
          value: row.value,
          label: row.label,
        }))}
      />
      <SearchWithIcon
        className="w-[250px]"
        placeholder="Search sale, customer, or reference"
        value={filters.search}
        onChange={(event) => set({ search: event.target.value })}
      />
    </div>
  );
}
