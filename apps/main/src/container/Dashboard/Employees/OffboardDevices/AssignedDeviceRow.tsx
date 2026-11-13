import React from "react";
import Image from "next/image";
import { roundedImage_placeholder } from "@/assets/images";
import { Checkbox } from "@/components/ui/checkbox";
import DispositionToggle from "./DispositionToggle";
import DeviceWipeSelect from "./DeviceWipeSelect";
import ReassignTargetPicker from "./ReassignTargetPicker";
import {
  type DeviceLine,
  type Disposition,
  type ReassignTarget,
  type WipeType,
} from "./offboardPricing";
import { useOffboardLineFee } from "./useOffboardLineFee";
import { useServiceFeeFormat } from "./useServiceFeeFormat";

export const OFFBOARD_COLUMN_TEMPLATE = "32px minmax(0,1.8fr) 360px 200px 90px";

interface Props {
  line: DeviceLine;
  employeeId: string;
  sourceCountry?: string;
  excludeIds: string[];
  selected: boolean;
  onSelectChange: (lineId: string, checked: boolean) => void;
  onDisposition: (lineId: string, value: Disposition) => void;
  onWipe: (lineId: string, value: WipeType) => void;
  onReassign: (lineId: string, target: ReassignTarget) => void;
  onFee: (lineId: string, fee: number) => void;
}

const AssignedDeviceRow: React.FC<Props> = ({
  line,
  employeeId,
  sourceCountry,
  excludeIds,
  selected,
  onSelectChange,
  onDisposition,
  onWipe,
  onReassign,
  onFee,
}) => {
  const formatFee = useServiceFeeFormat();
  const { amount, isLoading } = useOffboardLineFee({
    employeeId,
    line,
    onFee,
  });

  return (
    <div
      className="grid items-center gap-x-6 border-b border-gray-100 px-6 py-4 last:border-0"
      style={{ gridTemplateColumns: OFFBOARD_COLUMN_TEMPLATE }}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={(value) => onSelectChange(line.id, value === true)}
        aria-label={`Select ${line.name}`}
        className="h-5 w-5 shadow-none"
        data-testid="assigneddevicerow-checkbox"
      />

      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={line.imageUrl || roundedImage_placeholder}
          alt={line.name}
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded object-contain"
        />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-gray-900">
            {line.name}
          </span>
          <span className="truncate text-xs text-gray-500">
            SN {line.serial}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <DispositionToggle
          value={line.disposition}
          onChange={(value) => onDisposition(line.id, value)}
        />
        {line.disposition === "REASSIGN" && (
          <div className="min-w-0 flex-1">
            <ReassignTargetPicker
              sourceCountry={sourceCountry}
              excludeIds={excludeIds}
              value={line.reassignTarget}
              onSelect={(target) => onReassign(line.id, target)}
            />
          </div>
        )}
      </div>

      <DeviceWipeSelect
        value={line.wipeType}
        disposition={line.disposition}
        onChange={(value) => onWipe(line.id, value)}
      />

      <span className="text-sm font-medium tabular-nums text-gray-900">
        {isLoading ? "…" : formatFee(amount ?? line.fee)}
      </span>
    </div>
  );
};

export default AssignedDeviceRow;
