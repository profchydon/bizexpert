import Pagination from "@/components/Custom/Pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { AssetEntry } from "./DevicePickerDialog.utils";
import KitPill from "./KitPill";
import KitPreviewImage from "./KitPreviewImage";

export function DeviceList({
  alreadyAddedIds,
  devices,
  isFetching,
  onToggle,
  selected,
}: {
  alreadyAddedIds: string[];
  devices: AssetEntry[];
  isFetching: boolean;
  onToggle: (id: string) => void;
  selected: string[];
}) {
  return (
    <ul className="max-h-[430px] divide-y divide-gray-100 overflow-y-auto px-3 py-1">
      {isFetching && devices.length === 0 ? (
        <li className="py-10 text-center text-sm text-gray-500">
          Loading devices...
        </li>
      ) : devices.length === 0 ? (
        <li className="py-10 text-center text-sm text-gray-500">
          No devices found.
        </li>
      ) : (
        devices.map((device) => (
          <DeviceRow
            key={device.id}
            device={device}
            isAdded={alreadyAddedIds.includes(device.id)}
            isSelected={selected.includes(device.id)}
            onToggle={onToggle}
          />
        ))
      )}
    </ul>
  );
}

export function DevicePagination({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}) {
  if (lastPage <= 1) return null;
  return (
    <div className="border-t border-gray-200 px-6 py-3">
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}

function DeviceRow({
  device,
  isAdded,
  isSelected,
  onToggle,
}: {
  device: AssetEntry;
  isAdded: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  const summary = [device.category, ...device.specs].filter(Boolean);
  return (
    <li
      role="button"
      tabIndex={0}
      onClick={() => onToggle(device.id)}
      className={cn(
        "flex items-center gap-4 rounded-md px-3 py-3",
        isAdded
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-gray-50",
      )}
    >
      <Checkbox
        checked={isSelected || isAdded}
        disabled={isAdded}
        data-testid="devicepickerdevicelist-checkbox"
      />
      <ImageBox src={device.image} alt={device.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {device.name}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {summary.length > 0 && <span>{summary.join(" · ")}</span>}
          {isAdded && <KitPill>Already in kit</KitPill>}
        </p>
      </div>
    </li>
  );
}

function ImageBox({ src, alt }: { src: string | null; alt: string }) {
  return (
    <KitPreviewImage
      src={src}
      alt={alt}
      width={32}
      height={32}
      containerClassName="size-10 shrink-0 rounded-lg bg-gray-50 p-1"
      imageClassName="object-contain"
      labelClassName="bottom-0.5 px-1 py-0.5 text-[6px]"
    />
  );
}
