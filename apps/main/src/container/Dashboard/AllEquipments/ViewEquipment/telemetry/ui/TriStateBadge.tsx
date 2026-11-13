"use client";

import { AlertTriangle, CheckCircle, Clock } from "@untitledui/icons";
import type { BadgeColors } from "@/components/base/badges/badge-types";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { TRI_STATE_LABEL, TRI_STATE_TOOLTIP } from "../telemetryTooltips";
import type { TriState } from "../types";

// The PRD's hard rule: three visibly different states. "Not yet verified" must never
// read as a pass (or as a quiet blank), so it gets its own warning treatment and copy.
const META: Record<TriState, { color: BadgeColors; icon: typeof CheckCircle }> =
  {
    pass: { color: "success", icon: CheckCircle },
    fail: { color: "error", icon: AlertTriangle },
    not_verified: { color: "warning", icon: Clock },
  };

export function TriStateBadge({ state }: { state: TriState }) {
  const { color, icon } = META[state];
  return (
    <Tooltip title={TRI_STATE_TOOLTIP[state]} placement="top">
      <TooltipTrigger className="cursor-default">
        <BadgeWithIcon color={color} size="sm" iconLeading={icon}>
          {TRI_STATE_LABEL[state]}
        </BadgeWithIcon>
      </TooltipTrigger>
    </Tooltip>
  );
}
