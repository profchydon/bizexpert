"use client";

import { CheckCircle, Minus } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import type { ComparisonCell } from "./catalog";
import { ADDON_TOOLTIP } from "./featureHints";

export function PlanComparisonCell({ cell }: { cell: ComparisonCell }) {
  if (cell.kind === "included") {
    return (
      <CheckCircle
        aria-label="Included"
        className="size-5 text-fg-success-primary"
      />
    );
  }
  if (cell.kind === "excluded") {
    return (
      <Minus aria-label="Not included" className="size-4 text-fg-quaternary" />
    );
  }
  if (cell.kind === "addon") {
    return (
      <Tooltip title={ADDON_TOOLTIP} placement="top">
        <TooltipTrigger className="cursor-default">
          <Badge color="brand" size="sm">
            {cell.label || "Add-on"}
          </Badge>
        </TooltipTrigger>
      </Tooltip>
    );
  }
  return (
    <span className="text-sm text-secondary tabular-nums">
      {cell.label || "—"}
    </span>
  );
}
