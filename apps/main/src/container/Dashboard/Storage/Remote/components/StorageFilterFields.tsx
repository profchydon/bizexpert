"use client";

import type { Key } from "react-aria-components";
import { Select } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import { GRADE_DOT_CLASS } from "../data/storageMeta";
import type { StorageCountryOption } from "../hooks/useStorageInventoryApi";
import type {
  DeviceType,
  EntrySource,
  Grade,
  InventoryFilters,
  StorageStatus,
  WipeStatus,
} from "../types/storage";
import {
  GRADE_OPTIONS,
  SOURCE_ITEMS,
  STATUS_ITEMS,
  WIPE_ITEMS,
  countryItems,
  deviceTypeItems,
} from "../utils/filterOptions";

interface Props {
  filters: InventoryFilters;
  countryOptions: StorageCountryOption[];
  deviceTypes: DeviceType[];
  onChange: (patch: Partial<InventoryFilters>) => void;
}

export function StorageFilterFields({
  filters,
  countryOptions,
  deviceTypes,
  onChange,
}: Props) {
  const sel = (k: Key | null) => String(k ?? "all");

  return (
    <>
      <Select
        size="sm"
        label="Asset type"
        selectedKey={filters.deviceType}
        items={deviceTypeItems(deviceTypes)}
        onSelectionChange={(k) =>
          onChange({ deviceType: sel(k) as DeviceType | "all" })
        }
        data-testid="storagefilterfields-select"
      >
        {(i) => (
          <Select.Item id={i.id} icon={i.icon}>
            {i.label}
          </Select.Item>
        )}
      </Select>
      <Select
        size="sm"
        label="Status"
        selectedKey={filters.status}
        items={STATUS_ITEMS}
        onSelectionChange={(k) =>
          onChange({ status: sel(k) as StorageStatus | "all" })
        }
        data-testid="storagefilterfields-select-2"
      >
        {(i) => (
          <Select.Item id={i.id} icon={i.icon}>
            {i.label}
          </Select.Item>
        )}
      </Select>
      <Select
        size="sm"
        label="Country"
        selectedKey={filters.countryId}
        items={countryItems(countryOptions)}
        onSelectionChange={(k) => {
          const id = sel(k);
          if (id === "all") {
            onChange({ country: "all", countryId: "all" });
            return;
          }
          const match = countryOptions.find((c) => c.id === id);
          onChange({
            countryId: id,
            country: match?.name ?? "all",
          });
        }}
        data-testid="storagefilterfields-select-3"
      >
        {(i) => (
          <Select.Item id={i.id} icon={i.icon}>
            {i.label}
          </Select.Item>
        )}
      </Select>
      <Select
        size="sm"
        label="Source"
        selectedKey={filters.source}
        items={SOURCE_ITEMS}
        onSelectionChange={(k) =>
          onChange({ source: sel(k) as EntrySource | "all" })
        }
        data-testid="storagefilterfields-select-4"
      >
        {(i) => (
          <Select.Item id={i.id} icon={i.icon}>
            {i.label}
          </Select.Item>
        )}
      </Select>
      <Select
        size="sm"
        label="Wipe status"
        selectedKey={filters.wipe}
        items={WIPE_ITEMS}
        onSelectionChange={(k) =>
          onChange({ wipe: sel(k) as WipeStatus | "all" })
        }
        data-testid="storagefilterfields-select-5"
      >
        {(i) => (
          <Select.Item id={i.id} icon={i.icon}>
            {i.label}
          </Select.Item>
        )}
      </Select>
      <Select
        size="sm"
        label="Grade"
        selectedKey={filters.grade}
        items={GRADE_OPTIONS}
        onSelectionChange={(k) => onChange({ grade: sel(k) as Grade | "all" })}
        data-testid="storagefilterfields-select-6"
      >
        {(i) => (
          <Select.Item id={i.id}>
            <span className="flex flex-1 items-center justify-between gap-2">
              {i.label}
              {i.id !== "all" && (
                <span
                  className={cx(
                    "size-2 shrink-0 rounded-full",
                    GRADE_DOT_CLASS[i.id as Grade],
                  )}
                />
              )}
            </span>
          </Select.Item>
        )}
      </Select>
    </>
  );
}
