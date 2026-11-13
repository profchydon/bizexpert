import { cn } from "@/lib/utils";
import type { LocationType } from "@/types/bizexpert";
import { formatLocationType } from "./locationTypes";

const TYPE_CLASS: Record<LocationType, string> = {
  shop: "border-primary-600 text-primary-700",
  warehouse: "border-gray-600 text-gray-700",
  branch: "border-success-600 text-success-700",
};

export function LocationTypeBadge({ type }: { type: string }) {
  const className =
    TYPE_CLASS[type as LocationType] ?? "border-gray-400 text-gray-600";
  return (
    <span
      className={cn(
        "inline-flex cursor-default items-center whitespace-nowrap rounded-full border-[1.5px] px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {formatLocationType(type)}
    </span>
  );
}
