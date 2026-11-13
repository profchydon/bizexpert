import { dayCount } from "./historyWindow";
import type { AgentTelemetry } from "./types";

// The update card used to be nine key/value rows, five of which said nothing happened
// ("Nothing pending", "Not downloaded", "Not waiting") and two of which were the same
// measurement twice: time since restart in days, and current uptime in days and hours, both
// derived from patch.lastRebootDays. Five separate restart numbers sat in one viewport.
//
// Prose collapses them. A sentence can say "restarted 2 days ago, on Aug 28 at 2:52 PM"
// once, where a grid needs three rows to say it three ways.
export interface UpdateNarrative {
  lead: string;
  restart: string;
  /** Only when the update has been sitting on disk waiting for a restart. */
  pending: string | null;
  /** True when the two build strings match, so the reader is told rather than made to diff them. */
  buildsMatch: boolean;
  installedBuild: string;
  latestBuild: string;
}

const LEAD: Record<AgentTelemetry["update"]["state"], string> = {
  current: "Running the current build. Nothing is waiting on a restart.",
  restart_required:
    "The update is on disk. Its fix is not active until this device restarts.",
  restart_overdue:
    "The update has been on disk for a while and its fix is still not live.",
  available:
    "A newer build exists but is not on this device yet. Restarting will not apply it.",
  unknown: "The agent could not read the update state on this device.",
};

export function getUpdateNarrative(telemetry: AgentTelemetry): UpdateNarrative {
  const { update, os, patch } = telemetry;
  const installedBuild = `${os.name} ${os.version.split(" ")[0]} ${os.build}`;

  const restarted =
    patch.lastRebootDays === 0
      ? "Restarted today"
      : `Restarted ${dayCount(patch.lastRebootDays)} ago, on ${update.lastRestartLabel}`;
  const median = `The fleet restarts every ${dayCount(update.fleetMedianRestartDays)} on average.`;

  return {
    lead: LEAD[update.state],
    restart: `${restarted}. ${median}`,
    pending:
      update.pendingRestartDays === null
        ? null
        : `Downloaded ${update.downloadedOnLabel ?? "recently"}, so the fix has been waiting ${dayCount(update.pendingRestartDays)} for a restart.`,
    buildsMatch: installedBuild === update.latestOsVersion,
    installedBuild,
    latestBuild: update.latestOsVersion,
  };
}
