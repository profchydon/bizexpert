"use client";

import { FilterLines } from "@untitledui/icons";
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
} from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import type { StorageCountryOption } from "../hooks/useStorageInventoryApi";
import type { DeviceType, InventoryFilters } from "../types/storage";
import { activeFilterCount } from "../utils/activeFilters";
import { StorageFilterFields } from "./StorageFilterFields";
import {
  storageFilterPopoverBodyClass,
  storageFilterPopoverFooterClass,
  storageFilterPopoverPanelClass,
  storageFilterPopoverScrollClass,
} from "./storageFilterPopoverLayout";

interface Props {
  filters: InventoryFilters;
  countryOptions: StorageCountryOption[];
  deviceTypes: DeviceType[];
  onChange: (patch: Partial<InventoryFilters>) => void;
  onClearAll: () => void;
}

export function StorageFilterPopover({
  filters,
  countryOptions,
  deviceTypes,
  onChange,
  onClearAll,
}: Props) {
  const count = activeFilterCount(filters);

  return (
    <AriaDialogTrigger>
      <Button
        size="sm"
        color="secondary"
        iconLeading={FilterLines}
        data-testid="storagefilterpopover-button"
      >
        <span className="flex items-center gap-1.5">
          Filters
          {count > 0 && (
            <Badge size="sm" type="pill-color" color="brand">
              {count}
            </Badge>
          )}
        </span>
      </Button>
      <AriaPopover
        placement="bottom right"
        offset={8}
        containerPadding={16}
        className={storageFilterPopoverPanelClass}
      >
        <AriaDialog className="outline-hidden">
          <div className={storageFilterPopoverBodyClass}>
            <div className={storageFilterPopoverScrollClass}>
              <StorageFilterFields
                filters={filters}
                countryOptions={countryOptions}
                deviceTypes={deviceTypes}
                onChange={onChange}
              />
            </div>
            <div className={storageFilterPopoverFooterClass}>
              <button
                type="button"
                disabled={count === 0}
                onClick={onClearAll}
                className="text-sm font-semibold text-tertiary transition hover:text-primary disabled:opacity-40"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </AriaDialog>
      </AriaPopover>
    </AriaDialogTrigger>
  );
}
