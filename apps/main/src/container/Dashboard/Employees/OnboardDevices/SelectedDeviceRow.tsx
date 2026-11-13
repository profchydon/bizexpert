import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { roundedImage_placeholder } from "@/assets/images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeviceQuantityControl from "./DeviceQuantityControl";
import { formatSourceLabel, sourceBadgeVariant } from "./equipBadges";
import {
  DEVICE_CONFIG_OPTIONS,
  isDeviceConfigurable,
} from "./equipDeviceConfig";
import { formatCurrency, lineTotal } from "./equipItems";
import { useEquipDisplayCurrency } from "./useEquipDisplayCurrency";
import type { DeviceConfig, EquipDeviceItem } from "./equipTypes";

export const ONBOARD_COLUMN_TEMPLATE =
  "minmax(240px,3fr) 160px 120px 150px 150px 180px 120px 44px";

interface Props {
  item: EquipDeviceItem;
  onRemove: (lineId: string) => void;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onConfigChange: (lineId: string, config: DeviceConfig) => void;
  onFulfilmentDateChange: (lineId: string, fulfilmentDate: string) => void;
}

const SelectedDeviceRow: React.FC<Props> = ({
  item,
  onRemove,
  onQuantityChange,
  onConfigChange,
  onFulfilmentDateChange,
}) => {
  const currency = useEquipDisplayCurrency([item]);
  const isPending = item.source === "RFQ" || item.unitPrice == null;
  const isStorage = item.source === "STORAGE";
  const total = lineTotal(item);
  const subtitle = [item.category, item.specs].filter(Boolean).join(" · ");
  const showConfig = isDeviceConfigurable(item) || isStorage;
  const parsedFulfilmentDate = item.fulfilmentDate
    ? new Date(`${item.fulfilmentDate}T00:00:00`)
    : undefined;
  const earliestFulfilmentDate = (() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);
    return date;
  })();

  return (
    <div
      className="grid items-center gap-x-6 border-b border-gray-100 px-6 py-4 last:border-0"
      style={{ gridTemplateColumns: ONBOARD_COLUMN_TEMPLATE }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={item.thumbnail || roundedImage_placeholder}
          alt={item.name}
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded object-contain"
        />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-gray-900">
            {item.name}
          </span>
          {subtitle && (
            <span className="truncate text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant={sourceBadgeVariant(item)}>
          {formatSourceLabel(item)}
        </Badge>
      </div>

      <div className="text-sm text-gray-700">
        {isPending ? (
          <span className="italic text-gray-400">Pending quote</span>
        ) : (
          formatCurrency(item.unitPrice as number, currency)
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {isStorage ? (
          <span className="w-6 text-center text-sm tabular-nums text-gray-900">
            {item.quantity}
          </span>
        ) : (
          <DeviceQuantityControl
            quantity={item.quantity}
            onChange={(quantity) => onQuantityChange(item.lineId, quantity)}
          />
        )}
      </div>

      <div className="min-w-0">
        {showConfig ? (
          <Select
            value={item.config}
            onValueChange={(next) =>
              onConfigChange(item.lineId, next as DeviceConfig)
            }
            data-testid="selecteddevicerow-select"
          >
            <SelectTrigger className="h-9 text-sm text-gray-700">
              <SelectValue placeholder="Configuration" />
            </SelectTrigger>
            <SelectContent>
              {DEVICE_CONFIG_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </div>

      <div className="min-w-0">
        <DatePicker
          className="h-9 w-full"
          date={parsedFulfilmentDate as Date}
          placeHolder="Fulfilment date"
          disablePastDates
          minDate={earliestFulfilmentDate}
          setDate={(value) =>
            onFulfilmentDateChange(item.lineId, format(value, "yyyy-MM-dd"))
          }
        />
      </div>

      <div className="text-sm font-medium text-gray-900">
        {total == null ? (
          <span className="text-gray-400">—</span>
        ) : (
          formatCurrency(total, currency)
        )}
      </div>

      <div className="flex">
        <Button
          type="button"
          variant="outline"
          className="h-8 w-8 p-0 text-gray-500"
          aria-label={`Remove ${item.name}`}
          onClick={() => onRemove(item.lineId)}
          data-testid="selecteddevicerow-button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SelectedDeviceRow;
