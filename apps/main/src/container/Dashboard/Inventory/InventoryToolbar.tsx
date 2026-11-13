"use client";

import {
  ButtonGroup,
  ButtonGroupItem,
} from "@/components/base/button-group/button-group";
import { NativeSelect } from "@/components/base/select/select-native";
import type { Location } from "@/types/bizexpert";
import { INVENTORY_TABS, type InventoryTab } from "./inventoryTabs";

type Props = {
  tab: InventoryTab;
  onTab: (tab: InventoryTab) => void;
  locationId: string | null;
  locations: Location[];
  onLocation: (id: string | null) => void;
};

export function InventoryToolbar({
  tab,
  onTab,
  locationId,
  locations,
  onLocation,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <ButtonGroup
        size="md"
        selectedKeys={new Set([tab])}
        onSelectionChange={(keys) => {
          const next = Array.from(keys)[0] as InventoryTab | undefined;
          if (next) onTab(next);
        }}
      >
        {INVENTORY_TABS.map((item) => (
          <ButtonGroupItem key={item.id} id={item.id}>
            {item.label}
          </ButtonGroupItem>
        ))}
      </ButtonGroup>
      <NativeSelect
        aria-label="Filter by location"
        className="sm:w-[240px]"
        value={locationId ?? ""}
        onChange={(event) => onLocation(event.target.value || null)}
        options={[
          { value: "", label: "All locations" },
          ...locations.map((location) => ({
            value: location.id,
            label: location.name,
          })),
        ]}
      />
    </div>
  );
}
