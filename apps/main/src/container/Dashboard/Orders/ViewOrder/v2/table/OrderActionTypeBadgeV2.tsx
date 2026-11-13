import React from "react";
import { cn } from "@/lib/utils";

const CONFIG: Record<string, { label: string; className: string }> = {
  reassign: {
    label: "Reassign",
    className: "border-primary-200 bg-primary-50 text-primary-700",
  },
  resale: {
    label: "Resale",
    className: "border-success-200 bg-success-50 text-success-700",
  },
  storage: {
    label: "Storage",
    className: "border-gray-200 bg-gray-50 text-gray-700",
  },
  buy_to_storage: {
    label: "Buy to Storage",
    className: "border-purple-700/20 bg-purple-50 text-purple-700",
  },
  archive: {
    label: "Archive",
    className: "border-error-200 bg-error-50 text-error-700",
  },
};

const OrderActionTypeBadgeV2: React.FC<{ type?: string | null }> = ({
  type,
}) => {
  const config = type ? CONFIG[type] : undefined;
  if (!config) return <span className="text-gray-400">—</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
};

export default OrderActionTypeBadgeV2;
