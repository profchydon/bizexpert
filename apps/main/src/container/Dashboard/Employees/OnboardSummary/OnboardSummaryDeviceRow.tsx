import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { roundedImage_placeholder } from "@/assets/images";
import { Badge } from "@/components/ui/badge";
import {
  formatSourceLabel,
  sourceBadgeVariant,
} from "../OnboardDevices/equipBadges";
import {
  getDeviceConfigLabel,
  isDeviceConfigurable,
} from "../OnboardDevices/equipDeviceConfig";
import { formatCurrency, lineTotal } from "../OnboardDevices/equipItems";
import { useEquipDisplayCurrency } from "../OnboardDevices/useEquipDisplayCurrency";
import type { EquipDeviceItem } from "../OnboardDevices/equipTypes";

export const SUMMARY_COLUMN_TEMPLATE =
  "minmax(0,2.6fr) minmax(0,2fr) 1fr 0.6fr 0.9fr 0.9fr";

interface Props {
  item: EquipDeviceItem;
}

const OnboardSummaryDeviceRow: React.FC<Props> = ({ item }) => {
  const currency = useEquipDisplayCurrency([item]);
  const total = lineTotal(item);
  const fulfilmentDate = item.fulfilmentDate
    ? format(new Date(`${item.fulfilmentDate}T00:00:00`), "MMM d, yyyy")
    : null;

  return (
    <div
      className="grid items-center gap-x-6 border-b border-gray-100 px-6 py-4 last:border-0"
      style={{ gridTemplateColumns: SUMMARY_COLUMN_TEMPLATE }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={item.thumbnail || roundedImage_placeholder}
          alt={item.name}
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded object-contain"
        />
        <span className="truncate text-sm font-medium text-gray-900">
          {item.name}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant={sourceBadgeVariant(item)}>
          {formatSourceLabel(item)}
        </Badge>
        {isDeviceConfigurable(item) && (
          <Badge variant={item.config === "none" ? "gray" : "blue"}>
            {getDeviceConfigLabel(item.config)}
          </Badge>
        )}
      </div>

      <div className="text-sm text-gray-700">
        {fulfilmentDate ?? <span className="text-gray-400">—</span>}
      </div>

      <div className="text-sm text-gray-700 tabular-nums">{item.quantity}</div>

      <div className="text-sm text-gray-700">
        {item.unitPrice == null ? (
          <span className="italic text-gray-400">Pending</span>
        ) : (
          formatCurrency(item.unitPrice, currency)
        )}
      </div>

      <div className="text-sm font-medium text-gray-900">
        {total == null ? (
          <span className="text-gray-400">—</span>
        ) : (
          formatCurrency(total, currency)
        )}
      </div>
    </div>
  );
};

export default OnboardSummaryDeviceRow;
