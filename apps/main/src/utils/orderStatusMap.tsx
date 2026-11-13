import { Check, ClipboardCheck, Clock, RefreshCcw, X } from "lucide-react";
export type ASSET_ORDER_STATUS =
  | "product_setup"
  | "order_in_transit"
  | "order_delivered"
  | "awaiting"
  | "awaiting_response"
  | "in_progress"
  | "order_placed"
  | "completed"
  | "pending"
  | "picked_up"
  | "sold"
  | "pending_pickup"
  | "in_transit"
  | "in_storage"
  | "collection_completed"
  | "employee_unresponsive"
  | "scheduled"
  | "delivered"
  | "cancelled"
  | "order_cancelled"
  | "awaiting_cancellation"
  | "details_verified"
  | "details_updated"
  | "details_auto_verified"
  | "verification_pending";

export const orderStatusMap: Record<
  ASSET_ORDER_STATUS,
  {
    className: string;
    variant?: string;
    label: string;
    icon?: React.ReactNode;
  }
> = {
  product_setup: {
    className: "w-fit bg-warning-50 text-warning-700",
    label: "Product setup",
  },
  order_in_transit: {
    className: "w-fit bg-purple-50 text-purple-700",
    icon: <RefreshCcw className="w-fit text-gray-700 h-3 mr-1" />,
    label: "Order in transit",
  },
  order_delivered: {
    className: "w-fit text-[#ecfdf3]",
    icon: (
      <RefreshCcw className="w-fit dark:text-gray-50 text-primary-700 h-3 mr-1" />
    ),
    variant: "mild",
    label: "Order delivered",
  },
  awaiting: {
    className: "w-fit text-purple-700",
    icon: <RefreshCcw className="w-fit text-warning-700 h-3 mr-1" />,
    variant: "pending",
    label: "Awaiting payment",
  },
  awaiting_response: {
    className: "w-fit border-blue-200 bg-blue-50 text-blue-700",
    icon: <Clock className="w-fit text-blue-700 h-3 mr-1" />,
    variant: "pending",
    label: "Awaiting response",
  },
  in_progress: {
    className: "w-fit text-warning-700",
    icon: <RefreshCcw className="w-fit text-warning-700 h-3 mr-1" />,
    variant: "pending",
    label: "In progress",
  },
  pending: {
    className: "w-fit border border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]",
    icon: <ClipboardCheck className="w-fit text-[#B54708] h-3 mr-1" />,
    variant: "pending",
    label: "Pending",
  },
  verification_pending: {
    className: "w-fit border border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]",
    icon: <ClipboardCheck className="w-fit text-[#B54708] h-3 mr-1" />,
    variant: "pending",
    label: "Verification Pending",
  },
  order_placed: {
    className: "w-fit text-warning-700",
    icon: <RefreshCcw className="w-fit text-warning-700 h-3 mr-1" />,
    variant: "pending",
    label: "Order placed",
  },
  completed: {
    className: "w-fit text-success-700",
    icon: <Check className="w-fit text-success-700 h-4 mr-1" />,
    variant: "success",
    label: "Completed",
  },
  delivered: {
    className: "w-fit text-success-700",
    icon: <Check className="w-fit text-success-700 h-4 mr-1" />,
    variant: "success",
    label: "delivered",
  },
  picked_up: {
    className: "w-fit bg-purple-50 text-purple-700",
    icon: <RefreshCcw className="w-fit text-gray-700 h-3 mr-1" />,
    label: "Picked up",
  },
  pending_pickup: {
    className: "w-fit bg-purple-50 text-purple-700",
    icon: <RefreshCcw className="w-fit text-gray-700 h-3 mr-1" />,
    label: "Pending picked up",
  },
  sold: {
    className: "w-fit text-[#ecfdf3]",
    icon: (
      <RefreshCcw className="w-fit dark:text-gray-50 text-primary-700 h-3 mr-1" />
    ),
    variant: "mild",
    label: "Sold",
  },
  in_transit: {
    className: "w-fit text-purple-700",
    label: "In Transit",
    variant: "pending",
    // icon: <RefreshCcw className="w-fit text-purple-700 h-3 mr-1" />,
  },
  in_storage: {
    className: "w-fit text-gray-700",
    label: "In Storage",
    // icon: <RefreshCcw className="w-fit text-gray-700 h-3 mr-1" />,
    variant: "mild",
  },
  collection_completed: {
    className: "w-fit text-success-700",
    variant: "success",
    label: "Collection Completed",
  },
  employee_unresponsive: {
    className: "w-fit text-error-700",
    variant: "red",
    label: "Employee Unresponsive",
  },
  scheduled: {
    className: "w-fit text-warning-700",
    variant: "pending",
    label: "Scheduled",
  },
  cancelled: {
    className: "w-fit text-error-700 bg-error-50",
    icon: <X className="w-fit text-error-700 h-3 mr-1" />,
    variant: "error",
    label: "Cancelled",
  },
  order_cancelled: {
    className: "w-fit text-error-700 bg-error-50",
    icon: <X className="w-fit text-error-700 h-3 mr-1" />,
    variant: "error",
    label: "Order-Cancelled",
  },
  awaiting_cancellation: {
    className: "w-fit text-warning-700 bg-warning-50",
    icon: <RefreshCcw className="w-fit text-warning-700 h-3 mr-1" />,
    variant: "pending",
    label: "Awaiting Cancellation",
  },
  details_verified: {
    className: "w-fit text-success-700",
    icon: <Check className="w-fit text-success-700 h-4 mr-1" />,
    variant: "success",
    label: "Verified",
  },
  details_updated: {
    className: "w-fit text-primary-700 bg-primary-25",
    icon: <RefreshCcw className="w-fit text-primary-700 h-3 mr-1" />,
    variant: "mild",
    label: "Updated",
  },
  details_auto_verified: {
    className: "w-fit text-success-700 bg-success-50",
    icon: <Check className="w-fit text-success-700 h-4 mr-1" />,
    variant: "success",
    label: "Auto verified",
  },
};
