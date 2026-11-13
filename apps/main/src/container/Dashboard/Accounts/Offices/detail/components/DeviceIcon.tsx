import { cn } from "@/lib/utils";
import { deviceIconChipClass, deviceIconGlyphClass } from "./deviceIconClasses";
import { deviceTypeIcon } from "./deviceTypeMeta";

export function DeviceIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const Icon = deviceTypeIcon(type);
  return (
    <div className={cn(deviceIconChipClass, "size-10", className)} title={type}>
      <Icon className={cn("size-5", deviceIconGlyphClass)} />
    </div>
  );
}
