import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SelectedDeviceRow, {
  ONBOARD_COLUMN_TEMPLATE,
} from "./SelectedDeviceRow";
import type { DeviceConfig, EquipDeviceItem } from "./equipTypes";

const HEAD_LABELS = [
  "Device",
  "Source",
  "Price",
  "Qty",
  "Configuration",
  "Fulfilment date",
  "Line Total",
  "",
];

interface Props {
  items: EquipDeviceItem[];
  onAddDevice: () => void;
  onClearAll: () => void;
  onRemove: (lineId: string) => void;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onConfigChange: (lineId: string, config: DeviceConfig) => void;
  onFulfilmentDateChange: (lineId: string, fulfilmentDate: string) => void;
}

const SelectedDevicesCard: React.FC<Props> = ({
  items,
  onAddDevice,
  onClearAll,
  onRemove,
  onQuantityChange,
  onConfigChange,
  onFulfilmentDateChange,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-6 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">
            Selected Devices
          </h3>
          <Badge variant="blue">{items.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              className="h-9 gap-2 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={onClearAll}
              data-testid="selecteddevicescard-button"
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-2 px-3 text-sm font-semibold text-gray-700"
            onClick={onAddDevice}
            data-testid="selecteddevicescard-button-2"
          >
            <Plus className="h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1120px]">
          <div
            className="grid items-center gap-x-6 border-y border-gray-100 bg-gray-50 px-6 py-2.5"
            style={{ gridTemplateColumns: ONBOARD_COLUMN_TEMPLATE }}
          >
            {HEAD_LABELS.map((label, index) => (
              <div
                key={label || `head-${index}`}
                className="text-xs font-semibold text-gray-500"
              >
                {label}
              </div>
            ))}
          </div>
          {items.map((item) => (
            <SelectedDeviceRow
              key={item.lineId}
              item={item}
              onRemove={onRemove}
              onQuantityChange={onQuantityChange}
              onConfigChange={onConfigChange}
              onFulfilmentDateChange={onFulfilmentDateChange}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SelectedDevicesCard;
