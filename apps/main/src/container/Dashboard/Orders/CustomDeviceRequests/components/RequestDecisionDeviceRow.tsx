import type { Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { CustomDeviceRequest } from "../types";
import { formatCurrency } from "../utils";

export function RequestDecisionDeviceRow({
  currency,
  device,
  hideSelection = false,
  index,
  selectedDevices,
  setSelectedDevices,
}: {
  currency?: string;
  device: CustomDeviceRequest["devices"][number];
  hideSelection?: boolean;
  index: number;
  selectedDevices: Set<number>;
  setSelectedDevices: Dispatch<SetStateAction<Set<number>>>;
}) {
  const response = device.vendorResponse;
  const unavailable = response?.type === "unavailable";
  const selected = selectedDevices.has(index);
  const price = deviceDecisionPrice(device);
  const rowClassName = unavailable
    ? "bg-gray-100 opacity-60"
    : selected
      ? "bg-primary-50"
      : "bg-white hover:bg-gray-50";

  return (
    <div className={`flex items-start gap-3 px-4 py-3 ${rowClassName}`}>
      {hideSelection ? null : (
        <Checkbox
          checked={selected}
          disabled={unavailable}
          onCheckedChange={() => {
            if (unavailable) return;
            setSelectedDevices((previous) => {
              const next = new Set(previous);
              if (next.has(index)) next.delete(index);
              else next.add(index);
              return next;
            });
          }}
          className="mt-0.5 size-5"
          data-testid="requestdecisiondevicerow-checkbox"
        />
      )}
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`text-sm font-medium ${
              unavailable ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {device.name}
          </span>
          {response?.type === "alternative" && (
            <Badge variant="blue">Alternative</Badge>
          )}
          {unavailable && <Badge variant="error">Unavailable</Badge>}
        </div>
        {response?.type === "alternative" && response.alternative ? (
          <span className="text-xs text-gray-500">
            {response.alternative.name}
            {response.alternative.specs
              ? ` · ${response.alternative.specs}`
              : ""}
          </span>
        ) : null}
        {unavailable && response?.unavailableReason ? (
          <span className="text-xs text-error-700">
            {response.unavailableReason}
          </span>
        ) : null}
      </div>
      {!unavailable && (
        <div className="flex shrink-0 flex-col items-end">
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(price, currency)}
          </span>
        </div>
      )}
    </div>
  );
}

function deviceDecisionPrice(device: CustomDeviceRequest["devices"][number]) {
  const response = device.vendorResponse;
  if (response?.type === "quoted" && response.quotedPrice) {
    return response.quotedPrice * device.quantity;
  }
  if (response?.type === "alternative" && response.alternative) {
    return response.alternative.price * device.quantity;
  }
  return 0;
}
