import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomDeviceRequest, DeviceVendorResponse } from "../types";
import { formatCurrency } from "../utils";
import { RequestedDeviceExpandedContent } from "./RequestedDeviceExpandedContent";

function ResponseBadge({
  response,
}: Readonly<{ response?: DeviceVendorResponse }>) {
  if (!response) return null;

  const styles = {
    alternative: "bg-primary-50 text-primary-700",
    quoted: "bg-success-50 text-success-700",
    unavailable: "bg-error-50 text-error-700",
  } as const;

  const labels = {
    alternative: "Alternative",
    quoted: "Quoted",
    unavailable: "Unavailable",
  } as const;

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        styles[response.type],
      )}
    >
      {labels[response.type]}
    </span>
  );
}

interface RequestedDevicesCardProps {
  request: CustomDeviceRequest;
  expandedDevice: number | null;
  onToggleDevice: (index: number) => void;
  vendorTotal: number;
  hasVendorResponse: boolean;
}

export default function RequestedDevicesCard({
  request,
  expandedDevice,
  onToggleDevice,
  vendorTotal,
  hasVendorResponse,
}: Readonly<RequestedDevicesCardProps>) {
  const currency = request.currency;

  const totalQuantity = request.devices.reduce(
    (sum, device) => sum + device.quantity,
    0,
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-3">
        <span className="text-sm font-semibold text-gray-700">
          Requested Device(s)
        </span>
        <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
          {totalQuantity}
        </span>
      </div>

      <div className="flex flex-col divide-y divide-gray-200">
        {request.devices.map((device, index) => {
          const unitPrice =
            typeof device.unitPrice === "number" ? device.unitPrice : null;
          const hasUnitPrice = unitPrice !== null;
          const budgetTotal = unitPrice ? unitPrice * device.quantity : null;

          const isExpanded = expandedDevice === index;
          const response = device.vendorResponse;
          const quotedPrice =
            response?.type === "quoted" &&
            typeof response.quotedPrice === "number"
              ? response.quotedPrice
              : null;

          return (
            <div
              key={`${device.name}-${index}`}
              className={cn(
                "flex flex-col transition-colors duration-200",
                isExpanded && "bg-gray-50",
              )}
            >
              <button
                type="button"
                onClick={() => onToggleDevice(index)}
                className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="line-clamp-1 text-sm font-semibold text-gray-900">
                      {device.name}
                    </span>
                    <ResponseBadge response={response} />
                  </div>
                  <span className="text-sm text-gray-600">
                    ×{device.quantity}
                    {budgetTotal !== null &&
                      ` | Budget: ${formatCurrency(budgetTotal, currency)}`}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-gray-600 transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>

              {isExpanded && (
                <RequestedDeviceExpandedContent
                  budgetTotal={budgetTotal}
                  currency={currency}
                  device={device}
                  hasUnitPrice={hasUnitPrice}
                  quotedPrice={quotedPrice}
                  unitPrice={unitPrice}
                />
              )}
            </div>
          );
        })}
      </div>

      {hasVendorResponse && (
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">
              Quote total
            </span>
            <span className="text-sm font-bold text-gray-900">
              {formatCurrency(vendorTotal, currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
