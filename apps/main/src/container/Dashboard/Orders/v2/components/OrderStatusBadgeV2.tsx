import React from "react";
import {
  Check,
  ClipboardCheck,
  Clock,
  RefreshCcw,
  ShieldQuestion,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import CustomTooltip from "@/components/CustomTooltip";
import { cn } from "@/lib/utils";
import { aliasOrderStatus } from "./orderStatusBadgeKey";

type StatusKey =
  | "pending"
  | "verification_pending"
  | "in_progress"
  | "processing"
  | "completed"
  | "awaiting"
  | "awaiting_response"
  | "cancelled"
  | "awaiting_cancellation";

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; icon: LucideIcon; className: string; tooltip: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "border-purple-200 bg-purple-50 text-purple-700",
    tooltip: "Order placed and awaiting initial processing.",
  },
  awaiting_response: {
    label: "Awaiting response",
    icon: Clock,
    className: "border-blue-200 bg-blue-50 text-blue-700",
    tooltip:
      "Request sent to the pre-assigned vendor. Awaiting their response.",
  },
  verification_pending: {
    label: "Verification pending",
    icon: ShieldQuestion,
    className: "border-warning-200 bg-warning-50 text-warning-700",
    tooltip: "Awaiting address or delivery verification before fulfillment.",
  },
  in_progress: {
    label: "In progress",
    icon: RefreshCcw,
    className: "border-warning-200 bg-warning-50 text-warning-700",
    tooltip: "Items are being procured, prepared, or shipped.",
  },
  processing: {
    label: "Processing",
    icon: RefreshCcw,
    className: "border-warning-200 bg-warning-50 text-warning-700",
    tooltip: "The order is being processed.",
  },
  completed: {
    label: "Completed",
    icon: Check,
    className: "border-success-200 bg-success-50 text-success-700",
    tooltip: "Everything delivered and the order is closed.",
  },
  awaiting: {
    label: "Awaiting payment",
    icon: Clock,
    className: "border-purple-700/20 bg-purple-50 text-purple-700",
    tooltip: "Order placed and awaiting payment.",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "border-error-200 bg-error-50 text-error-700",
    tooltip: "Order was cancelled before fulfillment completed.",
  },
  awaiting_cancellation: {
    label: "Cancellation requested",
    icon: ClipboardCheck,
    className: "border-warning-200 bg-warning-50 text-warning-700",
    tooltip: "A cancellation request is pending review.",
  },
};

interface Props {
  status?: string | null;
  className?: string;
}

const OrderStatusBadgeV2: React.FC<Props> = ({ status, className }) => {
  const key =
    (aliasOrderStatus(status)?.toLowerCase() as StatusKey) || "in_progress";
  const config = STATUS_CONFIG[key] ?? STATUS_CONFIG.in_progress;
  const Icon = config.icon;

  return (
    <CustomTooltip content={config.tooltip}>
      <span
        className={cn(
          "inline-flex cursor-default items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
          config.className,
          className,
        )}
      >
        <Icon className="size-3" />
        {config.label}
      </span>
    </CustomTooltip>
  );
};

export default OrderStatusBadgeV2;
