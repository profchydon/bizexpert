import { Badge } from "@/components/base/badges/badges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BillingMode } from "../types";
import {
  billingModeColor,
  billingModeLabel,
  billingModeTooltip,
} from "../utils/badgeTooltips";

export function BillingModeBadge({ mode }: { mode: BillingMode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-default">
            <Badge color={billingModeColor[mode]} size="sm" type="pill-color">
              {billingModeLabel[mode]}
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent>{billingModeTooltip[mode]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
