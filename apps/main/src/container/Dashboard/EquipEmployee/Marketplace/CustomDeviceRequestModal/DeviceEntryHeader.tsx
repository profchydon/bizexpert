import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAssetTypeIcon, getDeviceLabel } from "./data";
import type { DeviceEntry } from "./types";

function DeviceEntryHeader({
  device,
  index,
  isOpen,
  onDelete,
  onToggle,
  totalDevices,
}: Readonly<{
  device: DeviceEntry;
  index: number;
  isOpen: boolean;
  onDelete: () => void;
  onToggle: () => void;
  totalDevices: number;
}>) {
  const AssetIcon = device.assetType
    ? getAssetTypeIcon(device.assetType)
    : null;

  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <button
        type="button"
        className="flex flex-1 items-center gap-2"
        onClick={onToggle}
      >
        {AssetIcon && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-gray-100">
            <AssetIcon className="size-4 text-gray-500" />
          </div>
        )}
        <span className="text-sm font-semibold text-gray-900">
          <span className="sm:hidden">{getDeviceLabel(device, index, 16)}</span>
          <span className="hidden sm:inline">
            {getDeviceLabel(device, index, 24)}
          </span>
        </span>
        {isOpen ? (
          <ChevronUp className="size-4 text-gray-500" />
        ) : (
          <ChevronDown className="size-4 text-gray-500" />
        )}
      </button>
      <button
        type="button"
        disabled={totalDevices <= 1}
        onClick={onDelete}
        className={cn(
          "rounded-md p-1.5 transition",
          totalDevices <= 1
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-600",
        )}
        aria-label={`Delete device ${index + 1}`}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export { DeviceEntryHeader };
