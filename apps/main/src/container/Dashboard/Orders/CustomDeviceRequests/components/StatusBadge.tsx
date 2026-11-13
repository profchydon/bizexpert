import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "../types";

interface StatusBadgeProps {
  status: RequestStatus;
}

export default function StatusBadge({ status }: Readonly<StatusBadgeProps>) {
  const statusMap: Record<
    RequestStatus,
    {
      label: string;
      variant: "pending" | "blue" | "success" | "error" | "gray";
    }
  > = {
    pending: { label: "Pending", variant: "pending" },
    waiting_for_action: { label: "Waiting For Action", variant: "blue" },
    accepted: { label: "Accepted", variant: "success" },
    confirmed: { label: "Confirmed", variant: "success" },
    rejected: { label: "Rejected", variant: "error" },
    expired: { label: "Expired", variant: "gray" },
  };

  const config = statusMap[status];

  return (
    <Badge className="w-fit" variant={config.variant}>
      {config.label}
    </Badge>
  );
}
