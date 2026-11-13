"use client";

import React, { useEffect, useState } from "react";
import { trackItemSourceSelected } from "@/lib/orderFlowAnalytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DevicePickerMarketplaceTab from "./DevicePickerMarketplaceTab";
import DevicePickerStorageTab from "./DevicePickerStorageTab";
import type { EquipDeviceItem, EquipEmployeeBasic } from "./equipTypes";

type TabKey = "storage" | "marketplace";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EquipEmployeeBasic;
  countryId?: string;
  currency?: string;
  addedAssetIds: Set<string>;
  unavailableStorageIds?: Set<string>;
  onAdd: (item: EquipDeviceItem) => void;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "storage", label: "From storage" },
  { key: "marketplace", label: "Marketplace" },
];

const AddDeviceModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  employee,
  countryId,
  currency,
  addedAssetIds,
  unavailableStorageIds,
  onAdd,
}) => {
  const [tab, setTab] = useState<TabKey>("marketplace");

  useEffect(() => {
    if (!isOpen) return;
    trackItemSourceSelected(tab, "onboard_devices");
  }, [isOpen, tab]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      data-testid="adddevicemodal-dialog"
    >
      <DialogContent className="flex h-[calc(100dvh-4rem)] max-h-[680px] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <div className="px-6 pb-4 pt-6">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Add devices
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600">
            For {employee.name}
            {employee.country ? ` — ${employee.country}` : ""}
          </DialogDescription>
        </div>

        <div className="flex gap-4 border-b border-gray-100 px-6">
          {TABS.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  "cursor-pointer whitespace-nowrap px-1 py-3 text-sm font-semibold transition-colors",
                  active
                    ? "border-b-2 border-b-primary-700 text-primary-700"
                    : "text-gray-500 hover:text-gray-700",
                )}
                data-testid="adddevicemodal-tab"
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {tab === "storage" ? (
            <DevicePickerStorageTab
              countryId={countryId}
              currency={currency}
              addedAssetIds={addedAssetIds}
              unavailableIds={unavailableStorageIds}
              onAdd={onAdd}
            />
          ) : (
            <DevicePickerMarketplaceTab
              countryId={countryId}
              addedAssetIds={addedAssetIds}
              onAdd={onAdd}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <Button
            type="button"
            variant="primary"
            className="h-11 px-4 text-sm font-semibold"
            onClick={() => onOpenChange(false)}
            data-testid="adddevicemodal-button"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceModal;
