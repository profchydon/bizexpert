import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { roundedImage_placeholder } from "@/assets/images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IEquipmentsInStorageByCountry } from "@/types/equipments";
import { buildStorageDeviceSpecs } from "./buildStorageDeviceSpecs";

interface Props {
  device: IEquipmentsInStorageByCountry;
  added: boolean;
  onAdd: (device: IEquipmentsInStorageByCountry) => void;
}

const StorageDeviceRow: React.FC<Props> = ({ device, added, onAdd }) => {
  const subtitle = buildStorageDeviceSpecs(device.specs);

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-4 last:border-0">
      <Image
        src={device.image_url || roundedImage_placeholder}
        alt={device.title}
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-lg object-contain"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-gray-900">
            {device.title}
          </span>
          <Badge variant="gray">In storage</Badge>
        </div>
        {subtitle && (
          <span className="truncate text-xs text-gray-500">{subtitle}</span>
        )}
      </div>
      <span className="shrink-0 text-sm font-semibold text-gray-900">Free</span>
      <Button
        type="button"
        variant="outline"
        className="h-9 w-20 shrink-0 gap-1 text-sm font-semibold text-gray-700"
        disabled={added}
        onClick={() => onAdd(device)}
        data-testid="storagedevicerow-button"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Added
          </>
        ) : (
          "Add"
        )}
      </Button>
    </div>
  );
};

export default StorageDeviceRow;
