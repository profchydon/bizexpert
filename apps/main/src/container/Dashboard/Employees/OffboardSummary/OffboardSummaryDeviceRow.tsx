import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { roundedImage_placeholder } from "@/assets/images";
import { Badge } from "@/components/ui/badge";
import {
  type DeviceLine,
  type Disposition,
} from "../OffboardDevices/offboardPricing";
import { useOffboardLineFee } from "../OffboardDevices/useOffboardLineFee";
import { useServiceFeeFormat } from "../OffboardDevices/useServiceFeeFormat";

export const SUMMARY_COLUMN_TEMPLATE =
  "minmax(0,2fr) 120px minmax(0,1.4fr) 110px 170px 90px";

const DISPOSITION_BADGE: Record<
  Disposition,
  { label: string; variant: "gray" | "blue" | "pending" }
> = {
  STORE: { label: "Store", variant: "gray" },
  REASSIGN: { label: "Reassign", variant: "blue" },
  DISPOSE: { label: "Dispose", variant: "pending" },
};

interface Props {
  line: DeviceLine;
  employeeId: string;
}

const OffboardSummaryDeviceRow: React.FC<Props> = ({ line, employeeId }) => {
  const badge = DISPOSITION_BADGE[line.disposition];
  const formatFee = useServiceFeeFormat();
  const { amount, isLoading } = useOffboardLineFee({ employeeId, line });

  return (
    <div
      className="grid items-center gap-x-4 border-b border-gray-100 px-6 py-3.5 last:border-0"
      style={{ gridTemplateColumns: SUMMARY_COLUMN_TEMPLATE }}
    >
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

      <Badge variant={badge.variant} className="w-fit">
        {badge.label}
      </Badge>

      <div className="min-w-0">
        {line.reassignTarget ? (
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-900">
              {line.reassignTarget.name}
            </p>
            {line.reassignTarget.country ? (
              <p className="truncate text-xs text-gray-500">
                {line.reassignTarget.country}
              </p>
            ) : null}
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </div>

      <Badge variant="success" className="w-fit gap-1">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Yes
      </Badge>

      <span className="truncate text-sm text-gray-700">{line.wipeType}</span>

      <span className="text-sm font-medium tabular-nums text-gray-900">
        {isLoading ? "…" : formatFee(amount ?? line.fee)}
      </span>
    </div>
  );
};

export default OffboardSummaryDeviceRow;
