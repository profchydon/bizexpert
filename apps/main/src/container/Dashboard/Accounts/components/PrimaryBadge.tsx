import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PRIMARY_LABEL, PRIMARY_TOOLTIP } from "../utils/badgeTooltips";
import {
  primaryBadgeClass,
  primaryBadgeIconClass,
  primaryBadgeMdClass,
  primaryBadgeMdIconClass,
} from "./primaryBadgeClasses";

export function PrimaryBadge({
  size = "sm",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex cursor-default self-center",
              primaryBadgeClass,
              size === "md" && primaryBadgeMdClass,
              className,
            )}
          >
            <Star
              className={
                size === "md" ? primaryBadgeMdIconClass : primaryBadgeIconClass
              }
            />
            {PRIMARY_LABEL}
          </span>
        </TooltipTrigger>
        <TooltipContent>{PRIMARY_TOOLTIP}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
