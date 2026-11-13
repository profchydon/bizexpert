"use client";

import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { LATEST_AGENT_VERSION } from "../agentTelemetry";
import {
  AGENT_ACTIVE_TOOLTIP,
  AGENT_NOT_INSTALLED_TOOLTIP,
  REVOKED_TOOLTIP,
  STALE_TOOLTIP,
} from "../telemetryTooltips";
import type { AgentTelemetry } from "../types";

// The agent's whole relationship to the device in one strip: when it arrived, what build
// it is on, when it last spoke. Present on every state, so the answer to "when did we last
// hear from this" is always in the same place.
//
// No "Sync now". The agent checks in on its own schedule and cannot be pushed, so the
// button promised something it could not do. This is a status strip, not a control.
export function SyncStatusBar({
  telemetry,
  revokedOn,
}: {
  telemetry: AgentTelemetry;
  revokedOn?: string;
}) {
  const { agentInstalled, isStale, agentUpToDate, agentVersion } = telemetry;

  // Revoked outranks the rest: the agent may well be installed and recently synced, we have simply
  // stopped accepting it. "No agent" would be wrong and "Agent active" would be worse.
  const state = revokedOn
    ? { color: "gray" as const, label: "Not collecting", tip: REVOKED_TOOLTIP }
    : !agentInstalled
      ? {
          color: "gray" as const,
          label: "No agent",
          tip: AGENT_NOT_INSTALLED_TOOLTIP,
        }
      : isStale
        ? {
            color: "warning" as const,
            label: "Agent stale",
            tip: STALE_TOOLTIP,
          }
        : {
            color: "success" as const,
            label: "Agent active",
            tip: AGENT_ACTIVE_TOOLTIP,
          };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-secondary bg-primary px-4 py-3 shadow-xs">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <Tooltip title={state.tip} placement="top">
          <TooltipTrigger className="cursor-default">
            <BadgeWithDot color={state.color} size="sm" type="pill-color">
              {state.label}
            </BadgeWithDot>
          </TooltipTrigger>
        </Tooltip>
        <span className="text-sm text-tertiary">
          {revokedOn ? (
            <>
              Stopped collecting on{" "}
              <span className="font-medium text-primary">{revokedOn}</span>
            </>
          ) : agentInstalled ? (
            <>
              Last synced{" "}
              <span className="font-medium text-primary tabular-nums">
                {telemetry.lastSyncedLabel}
              </span>{" "}
              <span className="text-quaternary">
                · {telemetry.lastSyncedRelative}
              </span>
            </>
          ) : (
            "No check-in on record"
          )}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {telemetry.firstSeenLabel && (
          <Tooltip
            title="When the agent first checked in from this device."
            placement="top"
          >
            <TooltipTrigger className="cursor-default text-sm text-tertiary">
              First seen{" "}
              <span className="font-medium text-secondary tabular-nums">
                {telemetry.firstSeenLabel}
              </span>
            </TooltipTrigger>
          </Tooltip>
        )}
        {agentInstalled && (
          <Tooltip
            title={
              agentUpToDate
                ? "This is the current agent version."
                : `An older build. Version ${LATEST_AGENT_VERSION} reports more signals.`
            }
            placement="top"
          >
            <TooltipTrigger className="cursor-default">
              <Badge color={agentUpToDate ? "gray" : "warning"} size="sm">
                Agent {agentVersion}
              </Badge>
            </TooltipTrigger>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
