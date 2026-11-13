import React from "react";
import { calculateRunningTotal, formatCurrency } from "./equipItems";
import type { EquipDeviceItem } from "./equipTypes";

interface Props {
  items: EquipDeviceItem[];
  currency?: string;
}

const RunningTotal: React.FC<Props> = ({ items, currency = "USD" }) => {
  const { total, hasPending } = calculateRunningTotal(items);

  return (
    <div className="flex items-center justify-end gap-2 px-1 text-sm">
      <span className="text-gray-500">Total:</span>
      <span className="font-semibold text-gray-900">
        {formatCurrency(total, currency)}
      </span>
      {hasPending && <span className="text-gray-500">+ pending quotes</span>}
    </div>
  );
};

export default RunningTotal;
