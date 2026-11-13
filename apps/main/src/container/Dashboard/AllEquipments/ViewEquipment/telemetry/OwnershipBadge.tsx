"use client";

import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { OWNERSHIP_LABEL, OWNERSHIP_TOOLTIP } from "./ownership";
import type { Ownership } from "./types";

// Blue for company property, quiet gray for an employee's personal device (their own
// hardware is the thing the company manages least, so it recedes).
const COLOR: Record<Ownership, "gray" | "blue"> = {
  company: "blue",
  employee: "gray",
};

// One label everywhere. "Company" on its own read as a category rather than as a statement
// about who owns the device, which is the thing the badge is actually for.
export function OwnershipBadge({ ownership }: { ownership: Ownership }) {
  return (
    <Tooltip title={OWNERSHIP_TOOLTIP[ownership]} placement="top">
      <TooltipTrigger className="cursor-default">
        <Badge color={COLOR[ownership]} size="sm">
          {OWNERSHIP_LABEL[ownership]}
        </Badge>
      </TooltipTrigger>
    </Tooltip>
  );
}
