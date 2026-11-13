import SearchWithIcon from "@/components/SearchWithIcon";
import { NativeSelect } from "@/components/base/select/select-native";
import { SALE_PAYMENT_METHOD_FILTER } from "../Sales/saleFilterOptions";

export type PaymentsFilterState = {
  search: string;
  method: string;
};

type Props = {
  filters: PaymentsFilterState;
  onChange: (next: PaymentsFilterState) => void;
};

export function PaymentsTableFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
      <NativeSelect
        value={filters.method}
        onChange={(event) =>
          onChange({ ...filters, method: event.target.value })
        }
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
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value })
        }
      />
    </div>
  );
}
