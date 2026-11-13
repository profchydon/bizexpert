import {
  CheckCircle,
  ClipboardCheck,
  Clock,
  CreditCard02,
  RefreshCw03,
  SlashCircle01,
} from "@untitledui/icons";
import type { IconComponentType } from "@/components/base/badges/badge-types";
import {
  type BadgeColor,
  BadgeWithIcon,
} from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";

export type OrderLevelStatus =
  | "pending-payment"
  | "pending"
  | "awaiting-request"
  | "verification-pending"
  | "in-progress"
  | "completed"
  | "cancelled";

const CONFIG: Record<
  OrderLevelStatus,
  {
    label: string;
    color: BadgeColor<"pill-color">;
    icon: IconComponentType;
    tooltip: string;
  }
> = {
  "pending-payment": {
    label: "Pending Payment",
    color: "gray",
    icon: CreditCard02,
    tooltip: "Order placed but payment has not been received yet.",
  },
  pending: {
    label: "Pending",
    color: "purple",
    icon: RefreshCw03,
    tooltip: "Order placed and awaiting initial processing.",
  },
  "awaiting-request": {
    label: "Awaiting response",
    color: "blue",
    icon: Clock,
    tooltip: "Request sent to the pre-assigned vendor.",
  },
  "verification-pending": {
    label: "Verification Pending",
    color: "orange",
    icon: ClipboardCheck,
    tooltip: "Employees still need to confirm delivery details.",
  },
  "in-progress": {
    label: "In progress",
    color: "warning",
    icon: RefreshCw03,
    tooltip: "Items are being procured, prepared, or shipped.",
  },
  completed: {
    label: "Completed",
    color: "success",
    icon: CheckCircle,
    tooltip: "Everything delivered and the order is closed.",
  },
  cancelled: {
    label: "Cancelled",
    color: "error",
    icon: SlashCircle01,
    tooltip: "Order was cancelled before fulfillment completed.",
  },
};

export function OrderStatusBadge({ status }: { status: OrderLevelStatus }) {
  const config = CONFIG[status];
  return (
    <Tooltip title={config.tooltip} placement="top">
      <TooltipTrigger className="cursor-default">
        <BadgeWithIcon size="sm" color={config.color} iconLeading={config.icon}>
          {config.label}
        </BadgeWithIcon>
      </TooltipTrigger>
    </Tooltip>
  );
}
