"use client";

import { Badge } from "@/components/base/badges/badges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function OfficeClosedBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-default">
            <Badge color="error" size="sm" type="pill-color">
              Closed
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          This office has been closed. It stays in your list for records.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
