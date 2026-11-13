import React from "react";
import CustomTooltip from "@/components/CustomTooltip";
import { OrderFlowType } from "@/types/offboarding";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<
  OrderFlowType,
  { label: string; tooltip: string; className: string }
> = {
  onboarding: {
    label: "Onboarding",
    tooltip:
      "Equipment is being set up and delivered to a new or existing employee.",
    className: "border-success-600 text-success-700",
  },
  offboarding: {
    label: "Off-boarding",
    tooltip:
      "Equipment is being collected and returned from a departing employee.",
    className: "border-gray-600 text-gray-700",
  },
  buy_to_storage: {
    label: "Buy to Storage",
    tooltip:
      "Equipment is purchased and shipped directly to a Rayda warehouse.",
    className: "border-purple-700 text-purple-700",
  },
  storage_order: {
    label: "Storage",
    tooltip: "Equipment is held in Rayda storage.",
    className: "border-gray-600 text-gray-700",
  },
  storage_to_employee: {
    label: "Storage to Employee",
    tooltip: "Equipment is deployed from a Rayda warehouse to an employee.",
    className: "border-primary-600 text-primary-700",
  },
  renew_storage: {
    label: "Renew Storage",
    tooltip:
      "Storage term is being extended for equipment held in a warehouse.",
    className: "border-warning-600 text-warning-700",
  },
  device_refresh: {
    label: "Device refresh",
    tooltip: "Existing equipment is being refreshed or replaced.",
    className: "border-primary-600 text-primary-700",
  },
  storage: {
    label: "Storage",
    tooltip:
      "Equipment is held in a Rayda warehouse on a recurring storage fee.",
    className: "border-[#0086c9] text-[#026aa2]",
  },
};

interface Props {
  type?: string | null;
  className?: string;
}

const OrderTypeBadgeV2: React.FC<Props> = ({ type, className }) => {
  if (!type) return null;

  const config = TYPE_CONFIG[type as OrderFlowType];
  if (!config) {
    return (
      <span
        className={cn(
          "inline-flex cursor-default items-center whitespace-nowrap rounded-full border-[1.5px] px-2 py-0.5 text-xs font-medium border-gray-400 text-gray-600",
          className,
        )}
      >
        {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </span>
    );
  }

  return (
    <CustomTooltip content={config.tooltip}>
      <span
        className={cn(
          "inline-flex cursor-default items-center whitespace-nowrap rounded-full border-[1.5px] px-2 py-0.5 text-xs font-medium",
          config.className,
          className,
        )}
      >
        {config.label}
      </span>
    </CustomTooltip>
  );
};

export default OrderTypeBadgeV2;
