import { useState } from "react";
import type { IAssetCategory } from "@/types/assets";
import { DeviceEntryForm } from "./DeviceEntryForm";
import { DeviceEntryHeader } from "./DeviceEntryHeader";
import { DeviceEntrySubtotal } from "./DeviceEntrySubtotal";
import type { DeviceEntry } from "./types";

function DeviceEntrySection({
  device,
  index,
  totalDevices,
  assetTypes,
  onChange,
  onDelete,
}: Readonly<{
  device: DeviceEntry;
  index: number;
  totalDevices: number;
  assetTypes: IAssetCategory[];
  onChange: (updated: DeviceEntry) => void;
  onDelete: () => void;
}>) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-lg border border-gray-200">
      <DeviceEntryHeader
        device={device}
        index={index}
        isOpen={isOpen}
        totalDevices={totalDevices}
        onDelete={onDelete}
        onToggle={() => setIsOpen((prev) => !prev)}
      />
      {!isOpen && (
        <DeviceEntrySubtotal
          className="px-4 py-2 text-sm text-gray-600"
          device={device}
          emptyLabel="No budget added"
        />
      )}
      {isOpen && (
        <div className="flex flex-col gap-4 p-4">
          <DeviceEntryForm
            device={device}
            assetTypes={assetTypes}
            onChange={onChange}
          />
          {device.budgetPrice && device.quantity && (
            <DeviceEntrySubtotal
              className="rounded-lg bg-gray-50 px-3 py-2 text-sm"
              device={device}
            />
          )}
        </div>
      )}
    </div>
  );
}

export { DeviceEntrySection };
