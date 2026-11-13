import { Badge } from "@/components/base/badges/badges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SubsidiaryStatus } from "../types";
import {
  statusColor,
  statusImplication,
  statusLabel,
  statusTooltip,
} from "../utils/badgeTooltips";

interface Props {
  status: SubsidiaryStatus;
  size?: "sm" | "md";
}

export function SubsidiaryStatusBadge({ status, size = "sm" }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-default">
            <Badge color={statusColor[status]} size={size} type="pill-color">
              {statusLabel[status]}
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium">{statusTooltip[status]}</p>
          <p className="mt-1 text-gray-200">{statusImplication[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
