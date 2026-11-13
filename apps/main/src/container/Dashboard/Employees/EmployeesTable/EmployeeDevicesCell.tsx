import Image from "next/image";
import { Laptop } from "lucide-react";
import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { roundedImage_placeholder } from "@/assets/images";
import { getEmployeeDevicePreview, type DeviceSource } from "./employeeDevices";

const circleClass =
  "relative flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white bg-tertiary";
const ringClass = "absolute inset-0 rounded-full border border-black/[0.08]";

const EmployeeDevicesCell = ({ row }: { row: DeviceSource }) => {
  const { items, visibleCount, extraCount, count } =
    getEmployeeDevicePreview(row);

  if (count === 0) {
    return (
      <Badge color="gray" size="sm">
        No devices
      </Badge>
    );
  }

  const label = items.length
    ? items.map((device) => device.title).join(", ")
    : `${count} device${count === 1 ? "" : "s"}`;

  return (
    <Tooltip title={label} placement="top">
      <TooltipTrigger>
        <div className="flex -space-x-1.5">
          {items.length > 0
            ? items.map((device) => (
                <div key={device.id} className={circleClass}>
                  <div className="absolute inset-[15%]">
                    <Image
                      src={device.imageUrl || roundedImage_placeholder}
                      alt={device.title}
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                  <span className={ringClass} />
                </div>
              ))
            : Array.from({ length: visibleCount }).map((_, index) => (
                <div key={index} className={circleClass}>
                  <Laptop className="size-4 text-fg-quaternary" />
                  <span className={ringClass} />
                </div>
              ))}

          {extraCount > 0 && (
            <div className={`${circleClass} bg-secondary`}>
              <span className="text-xs font-medium text-tertiary">
                +{extraCount}
              </span>
              <span className={ringClass} />
            </div>
          )}
        </div>
      </TooltipTrigger>
    </Tooltip>
  );
};

export default EmployeeDevicesCell;
