"use client";

import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import type { AgentTelemetry } from "../types";
import { getUpdateNarrative } from "../updateNarrative";
import {
  UPDATE_STATE_BADGE,
  UPDATE_STATE_LABEL,
  UPDATE_STATE_TEXT,
  UPDATE_STATE_TOOLTIP,
} from "../updateStatus";
import { DetailCard } from "../DetailCard";

// What is running, what is waiting, and how long it has been waiting. Said once each.
//
// This was a nine row key/value grid. Five of its rows reported nothing happening, and two
// of them ("Time since restart", "Current uptime") were the same field rendered in two
// units, so a healthy device carried five separate restart numbers in one viewport. The
// facts are unchanged; only the duplicates are gone.
//
// Deliberately absent: a count of how many times the OS has shown its restart prompt. Those
// are system notifications the agent has no view into, so a number here would be invented.
export function UpdateRestartCard({
  telemetry,
}: {
  telemetry: AgentTelemetry;
}) {
  const { update } = telemetry;
  const narrative = getUpdateNarrative(telemetry);

  // The badge is the only thing visible when the section is closed, so it carries the state.
  // It sits beside the disclosure button rather than inside it, which is what lets it be a
  // tooltipped badge at all.
  const badge = (
    <Tooltip title={UPDATE_STATE_TOOLTIP[update.state]} placement="top">
      <TooltipTrigger className="cursor-default">
        <Badge color={UPDATE_STATE_BADGE[update.state]} size="sm">
          {UPDATE_STATE_LABEL[update.state]}
        </Badge>
      </TooltipTrigger>
    </Tooltip>
  );

  return (
    <DetailCard
      title="Update and restart"
      collapsible
      defaultOpen={false}
      action={badge}
    >
      <p className={cx("text-sm font-medium", UPDATE_STATE_TEXT[update.state])}>
        {narrative.lead}
      </p>
      {narrative.pending && (
        <p className="mt-1 text-sm text-error-primary">{narrative.pending}</p>
      )}
      <p
        className={cx(
          "mt-1 text-sm",
          update.restartAgeOverdue ? "text-warning-primary" : "text-tertiary",
        )}
      >
        {narrative.restart}
      </p>

      {/* Two identical build strings stacked as separate rows asked the reader to diff
          fourteen characters to learn what the badge already said. Matching builds now say
          they match. */}
      <div className="mt-4 grid grid-cols-1 gap-x-6 border-t border-secondary pt-3 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
          <span className="text-tertiary">Installed build</span>
          <span className="font-medium text-primary tabular-nums">
            {narrative.installedBuild}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
          <span className="text-tertiary">Latest build</span>
          <span
            className={cx(
              "font-medium tabular-nums",
              narrative.buildsMatch ? "text-success-primary" : "text-primary",
            )}
          >
            {narrative.buildsMatch
              ? "Same as installed"
              : narrative.latestBuild}
          </span>
        </div>
      </div>
    </DetailCard>
  );
}
