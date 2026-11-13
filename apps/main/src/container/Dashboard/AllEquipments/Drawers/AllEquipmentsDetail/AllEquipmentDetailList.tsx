import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React, { FC, ReactNode } from "react";

type Status =
  | "unassigned"
  | "leased"
  | "assigned"
  | "in_storage"
  | "sold"
  | "request_sale"
  | "awaiting_assignment"
  | "request_storage"
  | "archived"
  | "in_transit"
  | "pending_pickup";

interface Props {
  title?: string | undefined;
  description?: string | ReactNode | undefined;
  badge?: boolean;
  status?: Status;
  children?: ReactNode;
  className?: string;
  titleStyle?: string;
  descriptionStyle?: string;
}
const AllEquipmentDetailList: FC<Props> = (props) => {
  const {
    title,
    description,
    badge,
    status,
    children,
    className,
    titleStyle,
    descriptionStyle,
  } = props;
  const newStatus = status as Status;

  const statusMap: Record<
    Status,
    { className: string; variant?: string; label: string }
  > = {
    assigned: {
      className: "w-fit text-success-700",
      variant: "success",
      label: "Assigned",
    },
    in_storage: {
      className: "w-fit text-gray-700",
      variant: "awaiting",
      label: "In Storage",
    },
    in_transit: {
      className: "w-fit text-gray-700",
      variant: "mild",
      label: "In Transit",
    },
    pending_pickup: {
      className: "w-fit text-gray-700",
      variant: "mild",
      label: "Pending Pickup",
    },
    leased: {
      className: "w-fit text-primary-700 bg-primary-25",
      label: "Leased",
    },
    unassigned: {
      className: "w-fit bg-purple-50 text-purple-700",
      label: "Unassigned",
    },
    awaiting_assignment: {
      className: "w-fit bg-purple-50 text-purple-700",
      variant: "gray",
      label: "Awaiting Assignment",
    },
    request_sale: {
      className: "w-fit bg-purple-50 text-purple-700",
      variant: "gray",
      label: "Request Sale",
    },
    request_storage: {
      className: "w-fit bg-purple-50 text-purple-700",
      variant: "gray",
      label: "Request Storage",
    },
    sold: {
      className: "w-fit bg-warning-50 text-warning-700",
      label: "Sold",
    },
    archived: {
      className: "w-fit bg-warning-50 text-warning-700",
      label: "Archived",
      variant: "default",
    },
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className={cn("font-medium text-[12px]", titleStyle)}>{title}</span>
      {description && (
        <span
          className={cn("font-normal  text-sm text-gray-600", descriptionStyle)}
        >
          {description}
        </span>
      )}

      {badge && newStatus && (
        <Badge
          className={statusMap[newStatus]?.className}
          variant={statusMap[newStatus]?.variant as any}
        >
          {statusMap[newStatus]?.label}
        </Badge>
      )}

      {children}
    </div>
  );
};

export default AllEquipmentDetailList;
