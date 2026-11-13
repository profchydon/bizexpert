import { SearchLg } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import type { StorageCountryOption } from "../hooks/useStorageInventoryApi";
import type { DeviceType, InventoryFilters } from "../types/storage";
import { StorageActiveFilters } from "./StorageActiveFilters";
import { StorageFilterPopover } from "./StorageFilterPopover";

interface Props {
  filters: InventoryFilters;
  countryOptions: StorageCountryOption[];
  deviceTypes: DeviceType[];
  onChange: (patch: Partial<InventoryFilters>) => void;
  onClearAll: () => void;
}

export function StorageToolbar({
  filters,
  countryOptions,
  deviceTypes,
  onChange,
  onClearAll,
}: Props) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-t border-secondary px-5 py-3">
        <div className="w-full min-w-[240px] sm:w-80">
          <Input
            size="sm"
            icon={SearchLg}
            aria-label="Search devices"
            placeholder="Search device, model, serial, country"
            value={filters.search}
            onChange={(value) => onChange({ search: value })}
            data-testid="storagetoolbar-input"
          />
        </div>
        <div className="ml-auto">
          <StorageFilterPopover
            filters={filters}
            countryOptions={countryOptions}
            deviceTypes={deviceTypes}
            onChange={onChange}
            onClearAll={onClearAll}
          />
        </div>
      </div>
      <StorageActiveFilters
        filters={filters}
        onChange={onChange}
        onClearAll={onClearAll}
      />
    </>
  );
}
